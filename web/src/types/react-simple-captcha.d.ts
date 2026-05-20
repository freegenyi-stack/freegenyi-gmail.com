declare module 'react-simple-captcha' {
  import * as React from 'react';
  export function loadCaptchaEnginge(num: number, bgColor?: string, textColor?: string, type?: string): void;
  export function LoadCanvasTemplateNoReload(): React.JSX.Element;
  export function validateCaptcha(val: string): boolean;
}
