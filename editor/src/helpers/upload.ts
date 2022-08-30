/**
 *
 * @param {*} route
 * @returns
 * @deprecated
 */
const getUploadUrlByRoute = (route: any) => {
  const { templateId, pageId } = route.params;
  if (templateId) {
    return `/api/upload/files/interfaceElements/${templateId}`;
  } else {
    return `/api/upload/files/pages/${pageId}`;
  }
};

export { getUploadUrlByRoute };
