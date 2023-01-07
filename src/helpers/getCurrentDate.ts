/*
 * Created on Fri Jan 06 2023
 *
 * Get current date func
 *
 * Copyright (c) 2023 - Novus Fintech
 */

// format date: MM-DD-YYYY -> 02-18-2020
export default function getCurrentDate() {
  const today = new Date();
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`;
  const date = `${month}-${day}-${today.getFullYear()}`;
  return date;
}
