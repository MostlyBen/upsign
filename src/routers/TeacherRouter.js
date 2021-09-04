import { Route, Switch } from 'react-router-dom';

import { TeacherSignUp, AllSessionOverview } from '../components';


const TeacherRouter = ({ db, user }) => {

  return (
      <Switch>
        <Route path="/overview/:session?"
          render={(matchProps) => ( <AllSessionOverview {...matchProps} /> )}
        />
        <Route path="/"
          render={() => ( <TeacherSignUp db={db} user={user} /> )}
        />
      </Switch>
  )
}

export default TeacherRouter