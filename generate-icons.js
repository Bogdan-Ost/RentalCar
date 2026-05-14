const { importDirectory, exportToJSON } = require("@iconify/tools");

async function run() {
  try {
    // 1. Імпортуємо всі іконки з вашої кореневої папки assets/custom-icons
    const iconSet = await importDirectory("assets/custom-icons", {
      prefix: "Custom", // префікс вашої колекції
    });

    // 2. Експортуємо їх у єдиний JSON файл у папку assets
    await exportToJSON(iconSet, {
      target: "assets/custom-icons.json",
    });

    console.log("Пак іконок успішно згенеровано в assets/custom-icons.json!");
  } catch (error) {
    console.error("Помилка під час генерації:", error);
  }
}

run();
