import "./style.css";

const WaveBackground = () => {
  return (
    <div className="auth-wave" aria-hidden="true">
      <svg
        className="auth-wave__svg"
        viewBox="0 0 500 900"
        preserveAspectRatio="none"
      >
        <g className="auth-wave__path auth-wave__path--back">
          <path d="M210 0C70 140 340 250 150 400C-20 550 300 700 200 900H500V0Z" />
        </g>
        <g className="auth-wave__path auth-wave__path--front">
          <path d="M290 0C150 160 400 290 230 440C70 590 360 740 270 900H500V0Z" />
        </g>
      </svg>
    </div>
  );
};

export default WaveBackground;
