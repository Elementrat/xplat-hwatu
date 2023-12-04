import React, { useContext } from "react";
import styles from "./CardAttachmentRenderer.module.css";
import { CardAttachment } from "xplat-lib";
import { CARD_ATTACHMENT_TYPES } from "xplat-lib/models/Card";
import clsx from "clsx";
import { linkOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { UIContext } from "xplat-lib";

const CardAttachmentRenderer = ({
  attachments,
  obscure
}: {
  attachments?: Array<CardAttachment>;
  obscure?: boolean;
}) => {
  const { studyMode } = useContext(UIContext);
  const hasContent = attachments?.find(
    (e) =>
      e.type === CARD_ATTACHMENT_TYPES.IMAGE ||
      e.type === CARD_ATTACHMENT_TYPES.LINK
  );

  const imageStyles = clsx({
    [styles.pictureAttachment]: true,
    [styles.obscure]: obscure
  });

  const rendererStyles = clsx({
    [styles.CardAttachmentRenderer]: true,
    [styles.hasImage]: hasContent
  });

  return (
    <div className={rendererStyles}>
      {attachments?.map((attachment, index) => {
        let contents;

        switch (attachment.type) {
          case CARD_ATTACHMENT_TYPES.IMAGE:
            contents = (
              <picture>
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
          case CARD_ATTACHMENT_TYPES.LINK:
            contents = !studyMode.active && (
              <div className={styles.linkAttachment}>
                <IonIcon icon={linkOutline} size="small" />
                <a href={attachment.url} target="_blank">
                  {attachment.title}
                </a>
              </div>
            );
            break;
        }

        return (
          <div key={`attachment-${index}`} className={styles.attachment}>
            {contents}
          </div>
        );
      })}
    </div>
  );
};

export { CardAttachmentRenderer };
