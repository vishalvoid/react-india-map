export const fetchSVGContent = async (): Promise<string> => {
  try {
    const response = await fetch("/india.svg");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.text();
  } catch (error) {
    console.error("Error loading SVG:", error);
    return "";
  }
};

// Added a safer type assertion for events
export const getEventTarget = (event: any): Element | null => {
  return event?.target || null;
};
