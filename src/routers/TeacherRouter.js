import { Route, Switch } from 'react-router-dom';

import { TeacherSignUp, AllSessionOverview, Config } from '../components';


const TeacherRouter = ({ db, user }) => {

  return (
      <Switch>
        <Route path="/overview/:session?"
          render={(matchProps) => ( <AllSessionOverview db={db} {...matchProps} /> )}
        />
        <Route path="/config/:menu?"
          render={(matchProps => ( <Config db={db} {...matchProps} /> ))}
        />
        <Route path="/"
          render={() => ( <TeacherSignUp db={db} user={user} /> )}
        />
      </Switch>
  )
}

export default TeacherRouter
