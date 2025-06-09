import './App.css'
import Router from './router/router';
import SettingsComponent from './settingsComponent/settingsComp';
import ThemeComponent from './ThemeManage/ThemeComp';
import Authsystem from './API/authProvider'

function App() {

  return (
    <>
    <SettingsComponent>
      <Authsystem>
    <ThemeComponent>
      <Router/>
      </ThemeComponent>
      </Authsystem>
      </SettingsComponent>
    </>
  )
}

export default App
