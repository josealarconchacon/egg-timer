import React from "react";
import EggTimer from "./components/EggTimer.jsx";

const App = () => {
  const current_year = new Date().getFullYear();
  const app_name = "Jose's Egg Timer";

  return (
    <div className="app-root">
      <header>
        <h1>Start Boiling</h1>
        <p className="subtitle">
          <b>Your Perfect Egg Every Time</b> The only timer you'll need
        </p>
        <div className="boiling-reminder">
          ⚠️ <strong>Important:</strong> Start the timer once water is boiling,
          not when you put eggs in!
        </div>
      </header>
      <main>
        <EggTimer />
      </main>
      <footer>
        <p>
          © {current_year} {app_name}
        </p>
      </footer>
    </div>
  );
};

export default App;
