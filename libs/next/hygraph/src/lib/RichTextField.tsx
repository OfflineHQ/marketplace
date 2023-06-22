import {
  RichText,
  type RichTextProps,
} from '@graphcms/rich-text-react-renderer';
import Image from 'next/image';
import Link from 'next/link';
import { TooltipWrapper } from '@ui/components';
import React from 'react';

export type RichTextFieldProps = RichTextProps;

export const RichTextField: React.FC<RichTextFieldProps> = (props) => {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="richTextField space-y-4">
      <RichText
        {...props}
        renderers={{
          Asset: {
            image: ({ url, alt, caption, width, height, blurDataUrl }) => {
              return (
                <Image
                  src={url}
                  alt={alt}
                  width={width}
                  height={height}
                  placeholder={blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={blurDataUrl}
                />
              );
            },
          },
          a: ({ children, openInNewTab, href, rel, title, ...rest }) => {
            if (href?.match(/^https?:\/\/|^\/\//i)) {
              return (
                <TooltipWrapper helperText={title}>
                  {/* eslint-disable-next-line react/jsx-no-target-blank */}
                  <a
                    href={href}
                    className="text-blue-500"
                    target={openInNewTab ? '_blank' : '_self'}
                    rel={rel || 'noopener noreferrer'}
                    {...rest}
                  >
                    {children}
                  </a>
                </TooltipWrapper>
              );
            }

            return (
              <Link href={href as string}>
                <TooltipWrapper helperText={title}>
                  <a {...rest} className="text-blue-500">
                    {children}
                  </a>
                </TooltipWrapper>
              </Link>
            );
          },
        }}
      />
    </div>
  );
};

export const RichTextFieldSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-5 w-3/4 rounded-full bg-muted"></div>
      <div className="h-3 w-1/2 rounded-full bg-muted"></div>
      <div className="h-3 w-2/3 rounded-full bg-muted"></div>
      <div className="h-3 w-3/5 rounded-full bg-muted"></div>
      <div className="h-3 w-1/2 rounded-full bg-muted"></div>
      <div className="h-3 w-3/4 rounded-full bg-muted"></div>
      <div className="h-3 w-1/3 rounded-full bg-muted"></div>
      <div className="h-3 w-2/5 rounded-full bg-muted"></div>
      <div className="h-3 w-1/2 rounded-full bg-muted"></div>
    </div>
  );
};
