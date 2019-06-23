import React from 'react';
import Highlight from 'react-highlight';

export function highlightSyntax(description, language = 'javascript') {
  const parts = description.split(/`/g);
  return parts.map((part, index) => {
    if ((index + 1) % 2 === 0) {
      return (
        <Highlight className="javascript" key={index}>
          {part}
        </Highlight>
      );
    }
    return part;
  });
}