import Image from 'next/image'
import React from 'react'

const HomePage = () => {
  return (
    <div>
      <Image src={"/HeapFlow.png"} alt='HeapFlow' height={500} width={500} />
      <h1>Welcome to HeapFlow</h1>
    </div>
  )
}

export default HomePage