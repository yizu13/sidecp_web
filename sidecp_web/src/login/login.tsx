import { useSettingContext } from '../settingsComponent/contextSettings';
import BackgroundLogin from './Background';
import Loginform from './LoginForm';



export default function Login(){
    const settings = useSettingContext()
    const {theme, themefunc} = settings;

      themefunc(false);

    console.log('hola')

    return (
      
      <BackgroundLogin>
        <Loginform/>
      </BackgroundLogin>

    )
}

