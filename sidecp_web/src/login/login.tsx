import { useSettingContext } from '../settingsComponent/contextSettings';
import BackgroundLogin from './Background';
import Loginform from './LoginForm';



export default function Login(){
    const settings = useSettingContext()
    const {theme, themefunc} = settings;

      themefunc('light');
      console.log(theme.palette.mode)

    return (
      
      <BackgroundLogin>
        <Loginform/>
      </BackgroundLogin>

    )
}

