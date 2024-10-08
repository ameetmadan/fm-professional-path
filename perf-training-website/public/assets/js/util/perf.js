/**
 * Custom Real User Monitoring Performance Agent
 * Demonstration for "Fundamentals of Web Performance"
 * by Todd Gardner <todd@toddhgardner.com>
 *
 * Not for production use.
 */
(() => {

  const payload = {
    url: window.location.href,
    dcl: 0, // DOM Content Loaded
    load: 0, // Page Load
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    cls: 0, // Cumulative Layout Shift
    fid: 0  // First Input Delay
  }

  // Navigation Performance Timings
  onDocumentReady(() => {
    setTimeout(() => { // "load" isn't done until the next cycle
      let navEntry = performance.getEntriesByType("navigation")[0];
      payload.dcl = navEntry.domContentLoadedEventStart;
      payload.load = navEntry.loadEventStart;
      console.log('Navigation Performance Timing', navEntry);
    }, 0);
  });

  // First Contentful Paint
  var fcpObserver = new PerformanceObserver((entryList) => {
    let entries = entryList.getEntries() || [];
    entries.forEach((entry) => {
      if (entry.name === "first-contentful-paint") {
        payload.fcp = entry.startTime;
        console.log(`FCP: ${payload.fcp}`);
      }
    });
  }).observe({ type: "paint", buffered: true });

  // Largest Contentful Paint
  var lcpObserver = new PerformanceObserver((entryList) => {
    let entries = entryList.getEntries() || [];
    entries.forEach((entry) => {
      if (entry.startTime > payload.lcp) {
        payload.lcp = entry.startTime;
        console.log(`LCP: ${payload.lcp}`);
      }
    });
  }).observe({ type: "largest-contentful-paint", buffered: true });

  // Cumulative Layout Shift
  var clsObserver = new PerformanceObserver((entryList) => {
    let entries = entryList.getEntries() || [];
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        payload.cls += entry.value;
        console.log(`CLS: ${payload.cls}`);
      }
    });
  }).observe({ type: "layout-shift", buffered: true });

  // First Input Delay
  var fidObserver = new PerformanceObserver((entryList) => {
    let entries = entryList.getEntries() || [];
    entries.forEach((entry) => {
      payload.fid = entry.processingStart - entry.startTime;
      console.log(`FID: ${payload.fid}`);
    });
  }).observe({ type: "first-input", buffered: true });


  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
      let data = JSON.stringify(payload);
      navigator.sendBeacon("/api/perf", data);
      console.log("Sending performance:", data);
    }
  });

})();



// Utility functions to make example easier to understand.
function onDocumentReady(onReady) {
  if (document.readyState === "complete") { onReady(); }
  else {
    document.addEventListener('readystatechange', (event) => {
      if (document.readyState === "complete") { onReady(); }
    });
  }
}

