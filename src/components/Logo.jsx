/**
 * Brand mark. Uses the official logo from public/assets; the alt text carries
 * the wordmark so screen readers and a broken-image state both still read
 * "SolarOps PH".
 */
export default function Logo({ className = "h-10 w-auto" }) {
  return (
    <img
      src="/assets/solarops-ph-logo.png"
      alt="SolarOps PH — Solar Estimator"
      className={className}
      width="160"
      height="40"
    />
  );
}
