import React from 'react';

interface Props {
  element: HTMLElement;
}

const HtmlElementWrapper: React.FC<Props> = ({ element }: Props) => {
  return <div dangerouslySetInnerHTML={{ __html: element.innerHTML }} />;
};

export default HtmlElementWrapper;