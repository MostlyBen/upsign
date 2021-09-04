import { Route, Switch } from 'react-router-dom';

import { StudentSignUp } from '../components';

const TestComponent = () => {
  return (
    <div>Test Component</div>
  )
}

const TeacherRouter = ({ db, user }) => {

  return (
      <Switch>
        <Route path="/test" render={() => ( <TestComponent /> )} />
        
        <Route path="/" render={() => ( <StudentSignUp db={db} user={user} /> )} />
      </Switch>
  )
}

export default TeacherRouter