import { useEffect } from "react";

import {
 useNavigate,
 useSearchParams
} from "react-router-dom";

import toast from "react-hot-toast";


function OAuthSuccess(){

const navigate = useNavigate();

const [searchParams] =
useSearchParams();


useEffect(()=>{

const accessToken =

searchParams.get(
"access_token"
);

const refreshToken =

searchParams.get(
"refresh_token"
);

const role =

searchParams.get(
"role"
);


if(

accessToken

&&

refreshToken

){

localStorage.setItem(

"token",

accessToken

);

localStorage.setItem(

"refresh_token",

refreshToken

);

localStorage.setItem(

"role",

role
);

toast.success(

"Google Login Success"

);

navigate(

"/dashboard"
);

}

else{

toast.error(

"OAuth Failed"

);

navigate(
"/"
);

}

},

[
navigate,
searchParams
]);


return(

<div style={styles.container}>

<div style={styles.card}>

<h2>

Signing you in...

</h2>

<p>

Please wait

</p>

</div>

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

"linear-gradient(135deg,#141e30,#243b55)"

},

card:{

padding:"30px",

background:

"white",

borderRadius:"12px"

}

};


export default OAuthSuccess;