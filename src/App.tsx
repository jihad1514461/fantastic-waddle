import { LandingPage } from './pages/LandingPage';
import { ToastContainer } from './components/ui/ToastContainer';
import { AdminLoginForm } from './modules/admin';
import { GameLoginForm } from './modules/game';
import { AdminLoginForm  as AdminMainLoginForm } from './modules/adminMain';
import { AdminApp as AdminMainApp } from './AdminMainApp';
import { AdminApp } from './AdminApp';
import { GameApp } from './GameApp';
import { useAppController } from './AppController';

function App() {
  const { appState, handleModuleSelect, handleGetStarted, handleBackToLanding } = useAppController();

  switch (appState) {
    case 'landing':
      return <LandingPage onModuleSelect={handleModuleSelect} onGetStarted={handleGetStarted} />;

    case 'admin-login':
      return <>
        <AdminLoginForm onBack={handleBackToLanding} />
        <ToastContainer />
      </>;
    case 'admin-main-login':
      return <>
        <AdminMainLoginForm onBack={handleBackToLanding} />
        <ToastContainer />
      </>;

    case 'admin-app':
      return <>
        <AdminApp />
        <ToastContainer />
      </>;
    case 'admin-main-app':
      return <>
        <AdminMainApp />
        <ToastContainer />
      </>;

    case 'game-login':
      return <>
        <GameLoginForm onBack={handleBackToLanding} />
        <ToastContainer />
      </>;

    case 'game-app':
      return <>
        <GameApp />
        <ToastContainer />
      </>;

    default:
      return <LandingPage onModuleSelect={handleModuleSelect} onGetStarted={handleGetStarted} />;
  }
}

export default App;
