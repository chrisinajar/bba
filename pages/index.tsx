import React, { useEffect, useState } from "react";

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";

const GameComponent = dynamic(() => import("../game/root"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div>
      <br />
      <br />
      <br />
      <GameComponent />
    </div>
  );
};

export default Home;
