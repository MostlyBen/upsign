import { Route, Switch } from 'react-router-dom';

import { StudentSignUp } from '../components';


const StudentRouter = ({ db, user }) => {

  return (
      <Switch>
        
        <Route path="/" render={() => ( <StudentSignUp db={db} user={user} /> )} />
      </Switch>
  )
}

export default StudentRouter