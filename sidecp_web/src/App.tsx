import './App.css'
import Router from './router/router';
import SettingsComponent from './settingsComponent/settingsComp';
import ThemeComponent from './ThemeManage/ThemeComp';
import Authsystem from './API/authProvider'
import CommitteEdit from './router/committeEditContext/committeEdit';

function App() {

  return (
    <>
    <SettingsComponent>
      <Authsystem>
    <ThemeComponent>
      <CommitteEdit>
      <Router/>
      </CommitteEdit>
      </ThemeComponent>
      </Authsystem>
      </SettingsComponent>
    </>
  )
}

export default App
