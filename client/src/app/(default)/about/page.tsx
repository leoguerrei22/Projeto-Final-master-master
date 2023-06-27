import React from 'react';

export default function About() {
  return (
    <div>
      <div className="border-2 bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-4">About us</h1>
        <h2 className="text-2xl font-bold mb-2">Lorem ipsum dolor sit amet</h2>
        <p className="text-gray-800 mb-4">Consectetur adipiscing elit. Ut dignissim ligula eu semper laoreet.</p>
        <p className="text-gray-700 mb-4">Sed auctor, erat non ullamcorper posuere, turpis velit fringilla arcu, eu fermentum ligula massa a justo.</p>
        <p className="text-gray-700">Vestibulum sed placerat magna, in pulvinar velit. Integer pretium nunc ac est pulvinar, vel tempus lectus semper.</p>
      </div>
    </div>
  );
}
