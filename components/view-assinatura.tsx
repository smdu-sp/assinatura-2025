"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Logo from "./logo";

interface AssinaturaProps {
  nome: string;
  cargo: string;
  unidade: string;
  secretaria: string;
  email: string;
  endereco: string;
  andar: string;
  endereco2: string;
  site: string;
  ramal: string;
  mode?: "display" | "copy";
}

export const ViewAssinatura = forwardRef<HTMLDivElement, AssinaturaProps>(
  (
    {
      nome,
      cargo,
      secretaria,
      email,
      endereco,
      andar,
      endereco2,
      site,
      ramal,
      mode = "display",
    },
    ref
  ) => {
    const copyModeContainerStyle: React.CSSProperties = {
      width: "500px",
      padding: "20px",
      backgroundColor: "#ffffff",

      position: "fixed",
      left: "-9999px",
      top: "-9999px",
      zIndex: "-1",
      opacity: "1",
      height: "auto",
      overflow: "visible",
      pointerEvents: "none",
    };

    const copyModeCommonTextStyle: React.CSSProperties = {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      lineHeight: "1.2",
      color: "#333333",
      margin: 0,
      padding: 0,
    };

    const copyModeNameStyle: React.CSSProperties = {
      ...copyModeCommonTextStyle,
      fontWeight: "bold",
      fontSize: "18.5px",
    };

    const copyModeUnderlineStyle: React.CSSProperties = {
      ...copyModeCommonTextStyle,
      fontWeight: "bold",
      textDecoration: "underline",
    };

    const copyModeSeparatorColumnStyle: React.CSSProperties = {
      width: "3px",
      backgroundColor: "#cccccc",
      padding: "0",
      verticalAlign: "middle",
    };
    const copyModeSeparatorDivStyle: React.CSSProperties = {
      width: "3px",
      height: "100%",
      backgroundColor: "#cccccc",
      lineHeight: "0",
      fontSize: "0",
    };

    if (mode === "copy") {
      return (
        <div
          id="assinatura-copia-oculta"
          ref={ref}
          style={copyModeContainerStyle}
        >
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            style={{ width: "100%" }}
            className="border-0 border-none"
          >
            <tbody>
              <tr>
                <td
                  style={{
                    paddingRight: "15px",
                    verticalAlign: "middle",
                    width: "200px",
                  }}
                >
                  <Logo />
                </td>
                <td style={copyModeSeparatorColumnStyle}>
                  <div style={copyModeSeparatorDivStyle}>&nbsp;</div>
                </td>
                <td style={{ paddingLeft: "15px", verticalAlign: "middle" }}>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ width: "100%" }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <p
                            style={{
                              ...copyModeNameStyle,
                              marginBottom: "2px",
                            }}
                          >
                            {nome.toUpperCase()}
                          </p>
                          <p style={copyModeCommonTextStyle}>
                            {cargo.toUpperCase()}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "10px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeUnderlineStyle}>
                            {secretaria.toUpperCase()}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "10px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeCommonTextStyle}>{email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "10px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeCommonTextStyle}>
                            {endereco.replace("${andar}", andar)}
                          </p>
                          <p style={copyModeCommonTextStyle}>{ramal}</p>
                          <p style={copyModeCommonTextStyle}>{endereco2}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "10px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeCommonTextStyle}>{site}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    // --- Renderização para o MODO DISPLAY (visual, com Tailwind CSS) ---
    return (
      <div
        id="assinatura"
        ref={ref}
        className="flex items-center border p-4 rounded-md bg-white"
      >
        <Image
          src="/img_assinatura.png"
          alt="logo"
          width={200}
          height={200}
          className="mr-2"
        />
        <div className="border-l-3 border-gray-400 h-60 mr-4"></div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-title-sans font-bold text-[18.5px]">
              {nome.toUpperCase()}
            </p>
            <p className="font-sans text-[12px]">{cargo.toUpperCase()}</p>
          </div>
          <div>
            <p className="font-sans underline font-bold text-[12px]">
              {secretaria.toUpperCase()}
            </p>
          </div>
          <div>
            <a href={`mailto:${email}`} className="font-sans text-[12px]">{email}</a>
          </div>
          <div>
            <p className="font-sans text-[12px]">
              {endereco.replace("${andar}", andar)}
            </p>
            <a href={`tel:${ramal}`} className="font-sans text-[12px]">{ramal}</a>
            <p className="font-sans text-[12px]">{endereco2}</p>
          </div>
          <div>
            <a href={site} className="font-sans text-[12px]">{site}</a>
          </div>
        </div>
      </div>
    );
  }
);

ViewAssinatura.displayName = "ViewAssinatura";
