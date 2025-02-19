import React from 'react';

export interface Data {
    id: number;
    pulse: number;
    DevUI: string;
    battery: number;
    humidity: number;
    temperature: number;
    time: Date;
    difference?: number;
    count?: number;
}

