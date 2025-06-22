/**
 * BottomFixedArea
 * =============================================================================
 * PURPOSE
 * -------
 * Keeps its children (typically a Call‑To‑Action button) visually pinned to the
 * **visible** bottom edge of the viewport on iOS Safari/Chrome *even while* the
 * on‑screen keyboard is animating in or out.
 *
 * WHY THIS COMPONENT EXISTS
 * -------------------------
 * 1. Mobile Safari & Chrome on iOS break `position: fixed` whenever the virtual
 *    keyboard appears. The `visualViewport` shrinks and the browser pans or
 *    resizes the page, so `bottom: 0` no longer means "bottom".
 * 2. Android resolved this issue back in 2019; iOS has not, so we guard all
 *    logic behind an `isIOS` check to avoid unnecessary work elsewhere.
 * 3. Product and design teams love bottom‑aligned CTAs because they convert
 *    well. Losing them under the keyboard is **not** acceptable.
 *
 * HIGH‑LEVEL STRATEGY
 * -------------------
 * We keep the CTA in normal document flow and translate it vertically using
 * `transform: translateY(...)`. The translation amount is simply the *negative*
 * height of the virtual keyboard, derived from the `visualViewport` API.
 *
 *     ┌──────────────────────────────┐   visualViewport.height
 *     │     (visible content)        │◄───────────────┐
 *     │                              │                │ offsetTop
 *     ├──────────────────────────────┤                │
 *     │  ┌─────────────┐             │                │
 *     │  │  keyboard   │             │◄───────────────┘ (CTA moves above this)
 *     │  └─────────────┘             │
 *     └──────────────────────────────┘
 *
 * KEY APIS & CONCEPTS
 * -------------------
 * • `window.visualViewport` — reveals the unobscured portion of the page.
 * • `visualViewport.resize / scroll` — fire on *every frame* of the keyboard
 *   animation, letting us sync the CTA in real‑time.
 * • `focusin / focusout` — reliable way to know when the keyboard is entering
 *   or leaving.
 * • `transform` over `top/bottom` — avoids reflow; critical for low‑end iPhones.
 *
 * EDGE CASES HANDLED
 * ------------------
 * • Page may or may not have its own scrollbar *before* the keyboard appears.
 * • Safari URL‑bar collapse introduces a phantom "height gap".
 * • Browsers fire `focusin` **before** the keyboard is fully visible; we wait
 *   300 ms to avoid flicker.
 * • Users can scroll or drag while typing; we fade the CTA so it doesn't block
 *   what they are reading.
 *
 * DEVELOPMENT & MAINTENANCE NOTES
 * -------------------------------
 * 1. Stick to GPU‑friendly `transform` properties; touching layout metrics
 *    inside scroll handlers will stutter.
 * 2. If a future iOS version fixes this quirk, delete the `useEffect` entirely
 *    and the component degrades to a simple wrapper.
 * 3. Do **not** polyfill `visualViewport`; the math below assumes native
 *    behavior.
 * 4. Performance budget: keep work under 1 RAF; handlers must stay light.
 */
import { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';

export const ScrollBehavior = {
  FADE_OUT: 'fade-out',
  CLOSE_KEYBOARD: 'close-keyboard',
} as const;

export type ScrollBehaviorType =
  (typeof ScrollBehavior)[keyof typeof ScrollBehavior];

export interface BottomFixedProps {
  children: ReactNode;
  className?: string;
  scrollBehavior?: ScrollBehaviorType;
}

export function BottomFixed({
  children,
  className,
  scrollBehavior = ScrollBehavior.FADE_OUT,
}: BottomFixedProps) {
  // DOM reference to the CTA container that we ultimately translate vertically
  const ctaRef = useRef<HTMLDivElement>(null);

  // Local UI state: hides the CTA briefly while the user scrolls or drags
  const [isHide, setIsHide] = useState(false);

  /**
   * Subscribe to viewport / keyboard / gesture events and keep the CTA
   * positioned exactly above the virtual keyboard.
   * Also adds a subtle fade-out while the user scrolls for better UX.
   */
  useEffect(() => {
    const ctaElement = ctaRef.current;
    const { visualViewport } = window;

    // Check iOS device
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (!ctaElement || !visualViewport || !isIOS) {
      return;
    }

    // Runtime flags --------------------------------------------------------------
    // * isKeyboardVisible — set to true on any focusin; resets on focusout.
    // * isKeyboardVisibleWithDelay — same, but only after a 300 ms delay so we
    //   know the keyboard finished its slide-in animation (prevents flicker).
    // * hasScroll — snapshot taken on focusin; tells us whether the document
    //   already had its own scrollbar *before* the keyboard showed up.
    let isKeyboardVisible = false;
    let isKeyboardVisibleWithDelay = false;
    let hasScroll = false;

    /**
     * placeCTA
     * --------
     * Writes the *negative* keyboard height into the `--kb-offset` custom
     * property so the CTA slides upward by exactly that amount.
     * Using `transform` offloads work to the GPU; 0 px restores original place.
     */
    const placeCTA = (keyboardHeight = 0) => {
      if (ctaRef.current) {
        ctaRef.current.style.transform = `translateY(-${keyboardHeight || 0}px)`;
      }
    };

    /**
     * viewportChangeHandler
     * ---------------------
     * Runs on every `visualViewport.resize` **and** `visualViewport.scroll`
     * event — effectively once per animation frame while the keyboard slides.
     *
     * Mental model
     * ------------
     * Case A — Document WAS scrollable before the keyboard:
     *   • `visualViewport.offsetTop` stays 0
     *   • viewport height shrinks
     *   • We subtract the Safari URL‑bar gap (`heightGap`) to avoid double count
     *
     * Case B — Document was NOT scrollable:
     *   • Browser pans the whole document upward
     *   • `visualViewport.offsetTop` grows from 0 → keyboardHeight
     *   • `scrollY` remains 0
     *   • We have to *add* that pan back to the translation so the CTA tracks
     *     the keyboard instead of the document.
     *
     * The resulting `bottomPosition` is the pixel amount we must translate the
     * CTA **upwards** (positive number). When the keyboard is closed,
     * bottomPosition collapses to 0 → translation becomes `translateY(0)`.
     */
    const viewportChangeHandler = () => {
      if (!visualViewport) return;

      // Current scrollY — relevant only when the page *was not* scrollable
      // before the keyboard; browsers then auto-pan the page upward.
      const scrollY = window.scrollY;

      // Gap caused by Safari URL-bar collapse; clamp to ≥ 0 to avoid negatives
      const heightGap = Math.max(
        0,
        document.documentElement.clientHeight - window.innerHeight,
      );

      // Desired bottom position of the CTA ---------------------------------------
      // if hasScroll === true  → document was scrollable pre-keyboard
      //   visualViewport.offsetTop stays 0, but its height shrinks; subtract
      //   heightGap so URL-bar collapse isn't counted twice.
      //
      // if hasScroll === false → document started *non-scrollable* and browser
      //   pans the page; visualViewport.offsetTop becomes positive, so we *add*
      //   scrollY to cancel out that pan.
      const bottomPosition = hasScroll
        ? window.innerHeight -
          (visualViewport.height + visualViewport.offsetTop - heightGap)
        : window.innerHeight -
          (visualViewport.height + visualViewport.offsetTop) +
          scrollY;

      // Don't move CTA if keyboard isn't visible yet
      if (!isKeyboardVisible) {
        return;
      }

      // Apply new offset (0 px means keyboard closed)
      placeCTA(bottomPosition);
    };

    // Subscribe with { passive:true } to avoid blocking scroll
    visualViewport?.addEventListener('resize', viewportChangeHandler, {
      passive: true,
    });
    visualViewport?.addEventListener('scroll', viewportChangeHandler, {
      passive: true,
    });

    // Initial placement
    viewportChangeHandler();

    // Delay timer — makes sure keyboard animation fully settles before we treat
    // it as "visible with delay".
    let keyboardVisibleDelayTimer: number | null = null;

    // ────────────── Focus Handlers ──────────────
    /**
     * Runs on any focusin event.
     */
    const focusinHandler = () => {
      hasScroll = document.documentElement.scrollHeight > window.innerHeight;
      isKeyboardVisible = true;

      if (keyboardVisibleDelayTimer)
        window.clearTimeout(keyboardVisibleDelayTimer);

      keyboardVisibleDelayTimer = window.setTimeout(() => {
        isKeyboardVisibleWithDelay = true;
      }, 500);

      // Re-position the CTA immediately after the keyboard is opened
      viewportChangeHandler();
    };

    /**
     * Runs on any focusout event.
     */
    const focusoutHandler = () => {
      // When the keyboard hides instantly (e.g. tapping non‑input areas) events can mix; defer the reset by one frame
      window.requestAnimationFrame(() => placeCTA(0));

      isKeyboardVisible = false;
      isKeyboardVisibleWithDelay = false;
      if (keyboardVisibleDelayTimer)
        window.clearTimeout(keyboardVisibleDelayTimer);
    };

    window.addEventListener('focusin', focusinHandler, { passive: true });
    window.addEventListener('focusout', focusoutHandler, { passive: true });

    // ────────────── Fade-out on gestures ──────────────
    // While typing, users often drag/scroll to peek at content obscured by the
    // keyboard.  We fade the CTA out during such gestures so it doesn't block
    // what the user is actively looking at.
    /**
     * UX: temporarily hide CTA while the user scrolls or drags
     * --------------------------------------------------------
     * Context
     *   When typing, users often swipe up a bit to peek at content that sits
     *   under the keyboard. A fixed CTA would block that exact area.
     *
     * Approach
     *   • On any touchstart that occurs *outside* the CTA and any `<input/>`,
     *     set `isHide = true` so the SCSS fades the button out (`opacity: 0`).
     *   • On touchend we wait 100 ms; on scroll idle we wait 200 ms before
     *     showing the CTA again to avoid flicker during small bounces.
     *
     * Why opacity instead of display/visibility?
     *   Opacity keeps the element in the flow so the translateY math remains
     *   intact; visibility or display would introduce layout jumps and lose
     *   pointer events.
     *
     * Tuning knobs
     *   Adjust the timeouts or switch to a CSS transition duration if design
     *   wants a snappier or slower reveal.
     */
    let timer: number | null = null;
    let isTouching = false;
    let lastTouchY = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      isTouching = true;
      touchStartY = event.touches[0].clientY;
      lastTouchY = touchStartY;
    };

    const handleTouchEnd = () => {
      isTouching = false;

      if (!isKeyboardVisibleWithDelay) return;
      if (timer) window.clearTimeout(timer);

      // Restore CTA after finger lifts (small delay prevents flicker)
      timer = window.setTimeout(() => setIsHide(false), 100);
    };

    /**
     * Common logic for hiding CTA during scroll or touch movement
     * Solves the scroll event delay issue caused by the address bar in iOS Chrome
     * by using touchmove events together with scroll events.
     */
    const handleScrollOrTouchMove = () => {
      if (!isKeyboardVisibleWithDelay) return;
      if (timer) window.clearTimeout(timer);

      if (scrollBehavior === ScrollBehavior.CLOSE_KEYBOARD) {
        // Close keyboard by removing focus from the active element
        if (
          isKeyboardVisible &&
          document.activeElement instanceof HTMLElement
        ) {
          document.activeElement.blur();
        }
        return;
      }

      // Continuous scroll/touch move → keep CTA hidden until movement pauses
      setIsHide(true);

      // Ignore scroll events while touching the screen
      if (isTouching) return;

      timer = window.setTimeout(() => setIsHide(false), 200);
    };

    const handleScroll = () => {
      handleScrollOrTouchMove();
    };

    /**
     * Touchmove event handler to solve scroll event delay issues caused by the address bar
     * in iOS Chrome. Provides more responsive UX by firing more immediately than scroll events.
     * Only triggers for vertical scrolling to avoid hiding CTA on horizontal swipes.
     */
    const handleTouchMove = (event: TouchEvent) => {
      if (!isTouching || !isKeyboardVisibleWithDelay) return;

      const currentTouchY = event.touches[0].clientY;
      const deltaY = Math.abs(currentTouchY - lastTouchY);
      const totalDeltaY = Math.abs(currentTouchY - touchStartY);

      // Only hide CTA if there's significant vertical movement (more than 5px)
      // This prevents hiding CTA on horizontal swipes or small finger movements
      if (deltaY > 5 || totalDeltaY > 10) {
        handleScrollOrTouchMove();
      }

      lastTouchY = currentTouchY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // ────────────── House-keeping ──────────────
    // Remove *all* listeners when component unmounts to prevent leaks.
    return () => {
      visualViewport?.removeEventListener('resize', viewportChangeHandler);
      visualViewport?.removeEventListener('scroll', viewportChangeHandler);
      window.removeEventListener('focusin', focusinHandler);
      window.removeEventListener('focusout', focusoutHandler);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollBehavior]);

  return (
    <div
      ref={ctaRef}
      className={[className, 'rbf-bottom-fixed-area', isHide && 'rbf-hide']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
