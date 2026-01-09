import './App.css'
import Router from './router/router';
import SettingsComponent from './settingsComponent/settingsComp';
import ThemeComponent from './ThemeManage/ThemeComp';
import Authsystem from './API/authProvider'
import CommitteEdit from './router/committeEditContext/committeEdit';
import SidebarProvider from './settingsComponent/SidebarProvider';
import React from 'react';


function App() {

  return (
    <>

    <SettingsComponent>
      <SidebarProvider>
        <Authsystem>
          <ThemeComponent>
            <CommitteEdit>
              <Router/>
            </CommitteEdit>
          </ThemeComponent>
        </Authsystem>
      </SidebarProvider>
    </SettingsComponent>
    </>
  )
}

export default App
