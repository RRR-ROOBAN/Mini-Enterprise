import {

useEffect,

useState

} from "react";

import API from "../services/api";

import {

useNavigate

} from "react-router-dom";


function Activity(){

const[

activities,

setActivities

]=useState([]);

const navigate=

useNavigate();


useEffect(()=>{

fetchActivities();

},[]);


const fetchActivities=

async()=>{

try{

const res=

await API.get(

"/activities/"

);

setActivities(

res.data||[]

);

}

catch(

err

){

console.log(

err

);

}

};


return(

<div style={styles.container}>


<div style={styles.topBar}>


<h1>

📋 Activity Timeline

</h1>


<button

style={styles.button}

onClick={()=>

navigate(

"/dashboard"

)

}

>

Dashboard

</button>


</div>


{

activities.map(

item=>(

<div

key={item.id}

style={styles.card}

>

<h3>

{item.action}

</h3>

<p>

{item.entity}

</p>

<p>

User :

{item.user_id}

</p>

<p>

{

new Date(

item.created_at

).toLocaleString()

}

</p>

</div>

)

)

}


</div>

);

}


const styles={

container:{

padding:"30px",

minHeight:"100vh",

background:
"#0f172a",

color:"#fff"

},

topBar:{

display:"flex",

justifyContent:
"space-between",

marginBottom:
"20px"

},

button:{

background:
"#2563eb",

border:"none",

padding:"10px",

color:"#fff",

borderRadius:"8px"

},

card:{

background:
"#1e293b",

padding:"20px",

marginBottom:"15px",

borderRadius:"12px"

}

};


export default Activity;