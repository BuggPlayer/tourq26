"use client";

import { Suspense } from "react";
import Base32Tool from "@/components/umbrella-tools/Base32Tool";
import Base58Tool from "@/components/umbrella-tools/Base58Tool";
import Base64Tool from "@/components/umbrella-tools/Base64Tool";
import BcryptTool from "@/components/umbrella-tools/BcryptTool";
import ChecksumCalculatorTool from "@/components/umbrella-tools/ChecksumCalculatorTool";
import CidrCalculatorTool from "@/components/umbrella-tools/CidrCalculatorTool";
import CodePlaygroundTool from "@/components/umbrella-tools/CodePlaygroundTool";
import CssShadowGeneratorTool from "@/components/umbrella-tools/CssShadowGeneratorTool";
import DatabaseUrlParserTool from "@/components/umbrella-tools/DatabaseUrlParserTool";
import HashGeneratorTool from "@/components/umbrella-tools/HashGeneratorTool";
import HmacTool from "@/components/umbrella-tools/HmacTool";
import JsonFormatterTool from "@/components/umbrella-tools/JsonFormatterTool";
import JsonToCsvTool from "@/components/umbrella-tools/JsonToCsvTool";
import JwtDecoderTool from "@/components/umbrella-tools/JwtDecoderTool";
import PdfExtractPagesTool from "@/components/umbrella-tools/PdfExtractPagesTool";
import PdfMergeTool from "@/components/umbrella-tools/PdfMergeTool";
import PastebinTool from "@/components/umbrella-tools/PastebinTool";
import QrCodeTool from "@/components/umbrella-tools/QrCodeTool";
import RandomStringTool from "@/components/umbrella-tools/RandomStringTool";
import ShapeDividerGeneratorTool from "@/components/umbrella-tools/ShapeDividerGeneratorTool";
import SvgGeneratorsHubTool from "@/components/umbrella-tools/SvgGeneratorsHubTool";
import SvgToCssBackgroundTool from "@/components/umbrella-tools/SvgToCssBackgroundTool";
import TimestampConverterTool from "@/components/umbrella-tools/TimestampConverterTool";
import UrlEncodeTool from "@/components/umbrella-tools/UrlEncodeTool";
import UuidGeneratorTool from "@/components/umbrella-tools/UuidGeneratorTool";
import {
  Base32DecoderTool,
  Base32EncoderTool,
  Base32ToHexTool,
  Base58DecoderTool,
  Base58EncoderTool,
  Base58ToHexTool,
  Base64DecoderTool,
  Base64EncoderTool,
  Base64ToHexTool,
  Base64ToImageTool,
  HexToBase32Tool,
  HexToBase58Tool,
  HexToBase64Tool,
  ImageToBase64Tool,
} from "@/components/umbrella-tools/bundled/baseConversionTools";
import { BcryptCheckerOnlyTool, BcryptGeneratorOnlyTool } from "@/components/umbrella-tools/bundled/bcryptSplitTools";
import {
  CssBeautifierTool,
  CssMinifierTool,
  CssValidatorTool,
  JsBeautifierTool,
  JsEscapeTool,
  JsMinifierTool,
  JsUnescapeTool,
} from "@/components/umbrella-tools/bundled/cssJsTools";
import { CryptoHashSlugTool, CryptoHmacSlugTool } from "@/components/umbrella-tools/bundled/cryptoSlugTools";
import {
  CsvToJsonTool,
  JsonEscapeTool,
  JsonMinifierTool,
  JsonToPhpArrayTool,
  JsonToXmlTool,
  JsonToYamlTool,
  JsonUnescapeTool,
  JsonValidatorStandaloneTool,
  PhpArrayToJsonTool,
  SqlEscapeTool,
  SqlFormatterTool,
  SqlMinifierTool,
  XmlDecoderTool,
  XmlEncoderTool,
  XmlEscapeTool,
  XmlFormatterTool,
  XmlMinifierTool,
  XmlToJsonTool,
  XmlUnescapeTool,
  XmlValidatorTool,
  YamlToJsonTool,
  YamlValidatorTool,
} from "@/components/umbrella-tools/bundled/jsonXmlYamlCsvPhpSql";
import {
  HtmlDecoderTool,
  HtmlEncoderTool,
  HtmlEscapeTool,
  HtmlFormatterTool,
  HtmlMinifierTool,
  HtmlStripperTool,
  HtmlToMarkdownTool,
  HtmlUnescapeTool,
  HtmlValidatorTool,
  MarkdownEditorTool,
  MarkdownToHtmlTool,
} from "@/components/umbrella-tools/bundled/htmlMarkdownTools";
import { MyIpTool, MyUserAgentTool, QrToTextTool } from "@/components/umbrella-tools/bundled/qrNetworkTools";
import { PassphraseGeneratorTool, PasswordGeneratorTool, PinGeneratorTool } from "@/components/umbrella-tools/bundled/randomPassTools";
import {
  CaseConverterTool,
  HexToTextTool,
  LineSorterTool,
  LoremIpsumTool,
  TextToHexTool,
  WhitespaceRemoverTool,
  WordCounterTool,
} from "@/components/umbrella-tools/bundled/textTools";
import { UrlDecoderTool, UrlEncoderTool, UrlParserTool, SlugGeneratorTool } from "@/components/umbrella-tools/bundled/urlTools";

function ToolFallback() {
  return <p className="text-sm text-muted-foreground">Loading tool…</p>;
}

export function DevToolsToolRouter({ slug }: { slug: string }) {
  switch (slug) {
    case "svg-generators":
      return <SvgGeneratorsHubTool />;
    case "svg-to-css-background":
      return <SvgToCssBackgroundTool />;
    case "shape-divider-generator":
      return <ShapeDividerGeneratorTool />;
    case "code-playground":
      return <CodePlaygroundTool />;
    case "css-shadow-generator":
      return <CssShadowGeneratorTool />;
    case "json-formatter":
      return <JsonFormatterTool />;
    case "jwt-decoder":
      return <JwtDecoderTool />;
    case "json-to-csv":
      return <JsonToCsvTool />;
    case "base64":
      return <Base64Tool />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "timestamp-converter":
      return <TimestampConverterTool />;
    case "url-encode":
      return <UrlEncodeTool />;
    case "database-url-parser":
      return <DatabaseUrlParserTool />;
    case "random-string":
      return <RandomStringTool />;
    case "base32-encode-decode":
      return <Base32Tool />;
    case "base58-encode-decode":
      return <Base58Tool />;
    case "hmac-generator":
      return <HmacTool />;
    case "bcrypt-hash":
      return <BcryptTool />;
    case "qr-code-generator":
      return <QrCodeTool />;
    case "cidr-calculator":
      return <CidrCalculatorTool />;
    case "checksum-calculator":
      return <ChecksumCalculatorTool />;
    case "pdf-merge":
      return <PdfMergeTool />;
    case "pdf-extract-pages":
      return <PdfExtractPagesTool />;
    case "pastebin":
      return (
        <Suspense fallback={<ToolFallback />}>
          <PastebinTool />
        </Suspense>
      );

    case "word-counter":
      return <WordCounterTool />;
    case "case-converter":
      return <CaseConverterTool />;
    case "line-sorter":
      return <LineSorterTool />;
    case "whitespace-remover":
      return <WhitespaceRemoverTool />;
    case "lorem-ipsum-generator":
      return <LoremIpsumTool />;
    case "text-to-hex":
      return <TextToHexTool />;
    case "hex-to-text":
      return <HexToTextTool />;

    case "url-parser":
      return <UrlParserTool />;
    case "url-encoder":
      return <UrlEncoderTool />;
    case "url-decoder":
      return <UrlDecoderTool />;
    case "slug-generator":
      return <SlugGeneratorTool />;

    case "html-formatter":
      return <HtmlFormatterTool />;
    case "html-minifier":
      return <HtmlMinifierTool />;
    case "html-encoder":
      return <HtmlEncoderTool />;
    case "html-decoder":
      return <HtmlDecoderTool />;
    case "html-escape":
      return <HtmlEscapeTool />;
    case "html-unescape":
      return <HtmlUnescapeTool />;
    case "html-validator":
      return <HtmlValidatorTool />;
    case "html-stripper":
      return <HtmlStripperTool />;

    case "markdown-editor":
      return <MarkdownEditorTool />;
    case "markdown-to-html":
      return <MarkdownToHtmlTool />;
    case "html-to-markdown":
      return <HtmlToMarkdownTool />;

    case "css-beautifier":
      return <CssBeautifierTool />;
    case "css-minifier":
      return <CssMinifierTool />;
    case "css-validator":
      return <CssValidatorTool />;

    case "js-beautifier":
      return <JsBeautifierTool />;
    case "js-minifier":
      return <JsMinifierTool />;
    case "js-escape":
      return <JsEscapeTool />;
    case "js-unescape":
      return <JsUnescapeTool />;

    case "json-minifier":
      return <JsonMinifierTool />;
    case "json-escape":
      return <JsonEscapeTool />;
    case "json-unescape":
      return <JsonUnescapeTool />;
    case "json-validator-standalone":
      return <JsonValidatorStandaloneTool />;

    case "xml-formatter":
      return <XmlFormatterTool />;
    case "xml-minifier":
      return <XmlMinifierTool />;
    case "xml-encoder":
      return <XmlEncoderTool />;
    case "xml-decoder":
      return <XmlDecoderTool />;
    case "xml-escape":
      return <XmlEscapeTool />;
    case "xml-unescape":
      return <XmlUnescapeTool />;
    case "xml-validator":
      return <XmlValidatorTool />;
    case "xml-to-json":
      return <XmlToJsonTool />;
    case "json-to-xml":
      return <JsonToXmlTool />;

    case "yaml-validator":
      return <YamlValidatorTool />;
    case "yaml-to-json":
      return <YamlToJsonTool />;
    case "json-to-yaml":
      return <JsonToYamlTool />;

    case "csv-to-json":
      return <CsvToJsonTool />;

    case "php-array-to-json":
      return <PhpArrayToJsonTool />;
    case "json-to-php-array":
      return <JsonToPhpArrayTool />;

    case "sql-formatter":
      return <SqlFormatterTool />;
    case "sql-minifier":
      return <SqlMinifierTool />;
    case "sql-escape":
      return <SqlEscapeTool />;

    case "password-generator":
      return <PasswordGeneratorTool />;
    case "passphrase-generator":
      return <PassphraseGeneratorTool />;
    case "pin-generator":
      return <PinGeneratorTool />;

    case "base32-encoder":
      return <Base32EncoderTool />;
    case "base32-decoder":
      return <Base32DecoderTool />;
    case "base32-to-hex":
      return <Base32ToHexTool />;
    case "hex-to-base32":
      return <HexToBase32Tool />;

    case "base58-encoder":
      return <Base58EncoderTool />;
    case "base58-decoder":
      return <Base58DecoderTool />;
    case "base58-to-hex":
      return <Base58ToHexTool />;
    case "hex-to-base58":
      return <HexToBase58Tool />;

    case "base64-encoder":
      return <Base64EncoderTool />;
    case "base64-decoder":
      return <Base64DecoderTool />;
    case "base64-to-hex":
      return <Base64ToHexTool />;
    case "hex-to-base64":
      return <HexToBase64Tool />;
    case "base64-to-image":
      return <Base64ToImageTool />;
    case "image-to-base64":
      return <ImageToBase64Tool />;

    case "md5-hash-generator":
    case "sha1-hash-generator":
    case "sha224-hash-generator":
    case "sha256-hash-generator":
    case "sha384-hash-generator":
    case "sha512-hash-generator":
    case "sha3-hash-generator":
    case "ripemd160-hash-generator":
      return <CryptoHashSlugTool slug={slug} />;

    case "hmac-md5":
    case "hmac-sha1":
    case "hmac-sha224":
    case "hmac-sha256":
    case "hmac-sha384":
    case "hmac-sha512":
    case "hmac-sha3":
    case "hmac-ripemd160":
      return <CryptoHmacSlugTool slug={slug} />;

    case "bcrypt-generator":
      return <BcryptGeneratorOnlyTool />;
    case "bcrypt-checker":
      return <BcryptCheckerOnlyTool />;

    case "qr-to-text":
      return <QrToTextTool />;
    case "my-ip":
      return <MyIpTool />;
    case "my-user-agent":
      return <MyUserAgentTool />;

    default:
      return (
        <p className="text-sm text-destructive">
          This slug is not mapped in DevToolsToolRouter. If you see this in production, report a bug.
        </p>
      );
  }
}
