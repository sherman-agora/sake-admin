/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import { useTranslate } from 'react-admin';

export default function NotFound() {
  const translate = useTranslate();
  return (
    <h1>
      {translate('pageNotFound')}
    </h1>
  );
}
