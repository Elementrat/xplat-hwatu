import React from "react";

import styles from "./CardAttachmentRenderer.module.css";
import { CardAttachment } from "xplat-lib";
import { CARD_ATTACHMENT_TYPES } from "xplat-lib/models/Card";
import clsx from "clsx";

const CardAttachmentRenderer = ({
  attachments,
  obscure
}: {
  attachments?: Array<CardAttachment>;
  obscure?: boolean;
}) => {
  const imageStyles = clsx({
    [styles.pictureAttachment]: true,
    [styles.obscure]: obscure
  });

  const hasImage = attachments?.find(
    (e) => e.type === CARD_ATTACHMENT_TYPES.IMAGE
  );

  const rendererStyles = clsx({
    [styles.CardAttachmentRenderer]: true,
    [styles.hasImage]: hasImage
  });

  return (
    <div className={rendererStyles}>
      {attachments?.map((attachment) => {
        let contents;

        switch (attachment.type) {
          case CARD_ATTACHMENT_TYPES.IMAGE:
            contents = (
              <picture key={attachment.url}>
                <img
                  className={imageStyles}
                  src={attachment.url}
                  alt="MDN Web Docs logo"
                  height="320"
                  width="520"
                />
              </picture>
            );
            break;
        }

        return <div>{contents}</div>;
      })}
    </div>
  );
};

export { CardAttachmentRenderer };
