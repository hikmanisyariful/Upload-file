import React from 'react';

export default function TruncateText({
    text,
    maxWidthStyle = 'w-full',
}: {
    text: string;
    maxWidthStyle?: string;
}) {
    return (
        <div className={`${maxWidthStyle} truncate`} title={text}>
            {text}
        </div>
    );
}
