import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { StudentSignUp } from '../components';

const TestComponent = () => {
  return (
    <div>Test Component</div>
  )
}

const TeacherRouter = ({ db, user }) => {

  return (
    <Router>
      <Switch>
        <Route path="/test" render={() => ( <TestComponent /> )} />
        
        <Route path="/" render={() => ( <StudentSignUp db={db} user={user} /> )} />
      </Switch>
    </Router>
  )
}

export default TeacherRouter