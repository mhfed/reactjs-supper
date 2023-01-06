/*
 * Created on Fri Jan 06 2023
 *
 * Excute copy
 *
 * Copyright (c) 2023 - Novus Fintech
 */

const copyToClipboard = (url: string) => {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  dummy.value = url;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
};

export default copyToClipboard;
