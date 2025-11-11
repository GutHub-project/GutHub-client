"use client";

import { Button } from "@repo/shared";

import styles from "../styles/index.module.css";

export default function Web() {
  return (
    <div className={styles.container}>
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Web</h1>
      <Button onClick={() => console.log("Pressed!")} text="Boop" />
      <div className="mt-4 p-4 bg-green-100 rounded-lg">
        <p className="text-green-800">Tailwind CSS is working! 🎨</p>
      </div>
    </div>
  );
}
