import { useSettingContext } from '../settingsComponent/contextSettings';
import BackgroundLogin from './Background';
import Loginform from './LoginForm';



export default function Login(){
    const settings = useSettingContext()
    const {themefunc} = settings;

      themefunc(false);

    return (
      
      <BackgroundLogin>
        <Loginform/>
      </BackgroundLogin>

    )
}

