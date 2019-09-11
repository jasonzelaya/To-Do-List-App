
// Return the date formatted "full day, full month, number" as a string
exports.currentDate = function() {
  // Get today's date
  let newDate = new Date();
  // Specify the desired date format for the title of the page
    let options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }

    // Return the date as a string
    return newDate.toLocaleDateString('en-US', options);

};
