import { Transforms } from 'slate';

import { createParagraphNode, deserializeForPasted } from './advancedFunctions';

export const withHtml = (editor: any) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element: any) => (element.type === 'link' ? true : isInline(element));

  editor.isVoid = (element: any) => (element.type === 'image' ? true : isVoid(element));

  const valuiOnlyText = (fragment: any[]) =>
    fragment.map((i) => {
      if (!i.type && i.text) {
        return createParagraphNode([{ text: i.text }]);
      } else {
        return i;
      }
    });

  editor.insertData = (data: any) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      let fragment = deserializeForPasted(parsed.body);
      fragment = valuiOnlyText(fragment);
      fragment = fragment.filter((i: any) => i.type);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

export const withHashTag = (editor: any) => {
  const { isInline } = editor;

  editor.isInline = (element: any) => (element.type === 'tag' ? true : isInline(element));
  return editor;
};

export const withLinks = (editor: any) => {
  const { isInline } = editor;

  editor.isInline = (element: any) => (element.type === 'link' ? true : isInline(element));

  return editor;
};
