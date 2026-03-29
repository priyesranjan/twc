"use client";
import React from 'react';

export default function Loading() {
  return (
    <div className="global-loader-container">
      <div className="spinner"></div>
      <div className="pulse-text">Loading TWC...</div>
    </div>
  );
}
