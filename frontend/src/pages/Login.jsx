import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";


function Login() {

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const navigate=useNavigate();


const handleLogin=async(e)=>{

e.preventDefault();

try{

const res=await API.post(

"/auth/login",

{

email,

password

}

);

localStorage.clear();

localStorage.setItem(

"token",

res.data.access_token

);

localStorage.setItem(

"refresh_token",

res.data.refresh_token

);

localStorage.setItem(

"role",

res.data.role

);

toast.success(

"Login successful"

);

navigate(

"/dashboard"

);

}

catch(err){

console.log(

"FULL ERROR",

err

);

console.log(

"RESPONSE",

err.response

);

console.log(

"DETAIL",

err.response?.data?.detail

);

toast.error(

err.response?.data?.detail

||

"Login failed"

);

}

};


const handleGoogleLogin=()=>{

window.location.href=

"http://127.0.0.1:8000/auth/google/login";

};


return(

<div style={styles.container}>

<form

onSubmit={handleLogin}

style={styles.card}

>

<h1 style={styles.title}>

Enterprise Workflow

</h1>


<p style={styles.subtitle}>

Sign in to continue

</p>


<input

style={styles.input}

placeholder="Email"

onChange={(e)=>

setEmail(

e.target.value

)

}

/>


<input

style={styles.input}

type="password"

placeholder="Password"

onChange={(e)=>

setPassword(

e.target.value

)

}

/>


<button

style={styles.button}

>

Login

</button>


<button

type="button"

style={styles.googleButton}

onClick={handleGoogleLogin}

>

Continue With Google

</button>


<p style={styles.text}>

Don't have account?

{" "}

<span

style={styles.link}

onClick={()=>

navigate(

"/register"

)

}

>

Register

</span>

</p>

</form>

</div>

);

}


const styles={

container:{

height:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

background:

"linear-gradient(135deg,#141e30,#243b55)",

fontFamily:"Arial"

},

card:{

background:

"rgba(255,255,255,0.08)",

backdropFilter:

"blur(12px)",

padding:"40px",

borderRadius:"18px",

width:"350px",

textAlign:"center",

boxShadow:

"0 8px 30px rgba(0,0,0,0.3)"

},

title:{

color:"#fff",

marginBottom:"10px"

},

subtitle:{

color:"#ddd",

marginBottom:"20px"

},

input:{

width:"100%",

padding:"12px",

margin:"10px 0",

border:"none",

borderRadius:"10px"

},

button:{

width:"100%",

padding:"12px",

background:"#0072ff",

border:"none",

borderRadius:"10px",

color:"#fff",

fontWeight:"bold",

cursor:"pointer"

},

googleButton:{

width:"100%",

padding:"12px",

marginTop:"12px",

background:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer",

fontWeight:"bold"

},

text:{

color:"#fff",

marginTop:"20px"

},

link:{

color:"#00c6ff",

cursor:"pointer"

}

};

export default Login;