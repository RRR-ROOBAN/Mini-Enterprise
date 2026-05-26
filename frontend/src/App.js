import {

BrowserRouter as Router,

Routes,

Route

} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Approvals from "./pages/Approvals";

import Kanban from "./pages/Kanban";

import CreateTask from "./pages/CreateTask";

import Comments from "./pages/Comments";

import EditTask from "./pages/EditTask";

import AuditLogs from "./pages/AuditLogs";

import Notifications from "./pages/Notifications";

import Documents from "./pages/Documents";

import OAuthSuccess from "./pages/OAuthSuccess";

import ProtectedRoute from "./components/ProtectedRoute";

import Activity from "./pages/Activity";

import AIInsights from "./pages/AIInsights";

import Billing from "./pages/Billing";

import Subscription from "./pages/Subscription";




function App(){

return(

<Router>

<Toaster

position="top-right"

reverseOrder={false}

/>

<Routes>

<Route

path="/"

element={<Login/>}

/>

<Route

path="/register"

element={<Register/>}

/>

<Route

path="/oauth-success"

element={<OAuthSuccess/>}

/>

<Route

path="/dashboard"

element={

<ProtectedRoute>

<Dashboard/>

</ProtectedRoute>

}

/>

<Route

path="/approvals"

element={

<ProtectedRoute>

<Approvals/>

</ProtectedRoute>

}

/>

<Route

path="/kanban"

element={

<ProtectedRoute>

<Kanban/>

</ProtectedRoute>

}

/>

<Route

path="/create-task"

element={

<ProtectedRoute>

<CreateTask/>

</ProtectedRoute>

}

/>

<Route

path="/edit-task/:id"

element={

<ProtectedRoute>

<EditTask/>

</ProtectedRoute>

}

/>

<Route

path="/comments"

element={

<ProtectedRoute>

<Comments/>

</ProtectedRoute>

}

/>

<Route

path="/notifications"

element={

<ProtectedRoute>

<Notifications/>

</ProtectedRoute>

}

/>

<Route

path="/audit-logs"

element={

<ProtectedRoute>

<AuditLogs/>

</ProtectedRoute>

}

/>

<Route

path="/documents"

element={

<ProtectedRoute>

<Documents/>

</ProtectedRoute>

}

/>

<Route

path="/ai-insights"

element={

<ProtectedRoute>

<AIInsights/>

</ProtectedRoute>

}

/>

<Route

path="/activity"

element={

<ProtectedRoute>

<Activity/>

</ProtectedRoute>

}

/>

<Route

path="/billing"

element={

<ProtectedRoute>

<Billing/>

</ProtectedRoute>

}

/>


<Route

path="/subscription"

element={

<ProtectedRoute>

<Subscription/>

</ProtectedRoute>

}

/>









</Routes>

</Router>

);

}

export default App;