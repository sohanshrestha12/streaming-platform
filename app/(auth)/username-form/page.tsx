'use client'
import { Button } from '@/components/ui/button';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, {useState } from 'react';

const Page = () => {
    const [username,setUsername] = useState("");
    const router = useRouter();

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const res = await fetch('/api/user/update-username',{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({username})
        });
        if(res.ok){
            await getSession();
            router.push('/');
        }else{
            console.log('Failed to set the username');
        }
    }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
      <Button type='submit'>Continue</Button>
    </form>
  )
}

export default Page
