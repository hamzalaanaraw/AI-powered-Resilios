import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  hostedButtonId?: string; // hosted button id from PayPal hosted buttons
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ hostedButtonId = 'ZEHMRCDY46HTC' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const res = await fetch('/config');
        const cfg = await res.json();
        const clientId = cfg.paypalClientId || '';

        // Build PayPal SDK url
        const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&components=hosted-buttons&disable-funding=venmo&currency=USD`;

        // Avoid injecting twice
        if (!document.querySelector(`script[src^="https://www.paypal.com/sdk/js"]`)) {
          const s = document.createElement('script');
          s.src = sdkUrl;
          s.async = true;
          s.crossOrigin = 'anonymous';
          document.head.appendChild(s);
          // wait for script to load
          await new Promise((resolve, reject) => {
            s.onload = () => resolve(null);
            s.onerror = (e) => reject(e);
          });
        } else {
          // If SDK already present, wait a tick
          await new Promise((r) => setTimeout(r, 50));
        }

        if (!mounted) return;

        // Render hosted button
        // @ts-ignore - paypal global provided by SDK
        if ((window as any).paypal && containerRef.current) {
          try {
            (window as any).paypal.HostedButtons({ hostedButtonId }).render(`#${containerRef.current.id}`);
          } catch (e) {
            // If hosted button render fails, show fallback text
            containerRef.current.innerHTML = '<div class="text-sm text-slate-600">PayPal button unavailable. Please try subscribing via Stripe.</div>';
          }
        }
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div class="text-sm text-slate-600">Unable to load PayPal. Try again later.</div>';
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [hostedButtonId]);

  // provide a stable id so PayPal HostedButtons can target it
  const id = `paypal-container-${hostedButtonId}`;

  return (
    <div className="w-full">
      {loading && <div className="text-xs text-slate-500 mb-2">Loading PayPal...</div>}
      <div id={id} ref={containerRef} />
    </div>
  );
};

export default PayPalButton;
