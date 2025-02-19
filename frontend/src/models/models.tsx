import React from 'react';

export interface Data {
    pulse: number;
    DevUI: string;
    battery: number;
    humidity: number;
    temperature: number;
    time: Date | string;
    difference?: number;
    count?: number;
}

