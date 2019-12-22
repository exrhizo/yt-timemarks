function install() {
  console.log(`YT Timemark - adding key event`);
  withCapture((onkeydown) => {
    document.onkeydown = onkeydown;
  });
}

install();