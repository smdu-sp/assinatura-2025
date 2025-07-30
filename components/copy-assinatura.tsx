// components/copy-assinatura.tsx (REVISADO)
import React, { forwardRef } from 'react';
import logo from '@/public/img_assinatura.png'; // Make sure this resolves to a public URL for email clients

interface CopyAssinaturaProps {
  nome: string;
  cargo: string;
  unidade: string;
  secretaria: string;
  email: string;
  telefone: string;
  endereco: string;
  andar: string;
  endereco2: string;
  site: string;
}

export const CopyAssinatura = forwardRef<HTMLDivElement, CopyAssinaturaProps>(
  (
    {
      nome,
      cargo,
      // unidade,
      secretaria,
      email,
      telefone,
      endereco,
      andar,
      endereco2,
      site,
    },
    ref
  ) => {
    const containerStyle: React.CSSProperties = {
      width: '500px',
      padding: '20px',
      // border: '1px solid #cccccc',
      //borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
      zIndex: '-1',
      opacity: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
      height: '1px',
    };

    const commonTextStyle: React.CSSProperties = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      lineHeight: '1.2',
      color: '#333333',
      margin: 0,
      padding: 0,
    };

    const nameStyle: React.CSSProperties = {
      ...commonTextStyle,
      fontWeight: 'bold',
      fontSize: '18.5px',
    };

    const underlineStyle: React.CSSProperties = {
      ...commonTextStyle,
      fontWeight: 'bold',
      textDecoration: 'underline',
    };


    const separatorColumnStyle: React.CSSProperties = {
      width: '3px',
      backgroundColor: '#cccccc',
      padding: '0',
      verticalAlign: 'middle',
    };
    const separatorDivStyle: React.CSSProperties = {
      width: '3px',
      height: '100%', 
      backgroundColor: '#cccccc',
      lineHeight: '0', 
      fontSize: '0',
    };

    const imageUrl = typeof logo === 'object' && 'src' in logo ? logo.src : '';

    return (
      <div id="assinatura-copia" ref={ref} style={containerStyle}>
        <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>
          <tr>

            <td style={{ paddingRight: '15px', verticalAlign: 'middle', width: '200px' }}>
              {imageUrl && (
                 <img src={imageUrl} alt="logo" width="200" height="auto" style={{ display: 'block' }} />
              )}
            </td>

            <td style={separatorColumnStyle}>
                <div style={separatorDivStyle}>&nbsp;</div> 
            </td>

            <td style={{ paddingLeft: '15px', verticalAlign: 'middle' }}>
              <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%' }}>

                <tr>
                  <td>
                    <p style={{ ...nameStyle, marginBottom: '2px' }}>{nome.toUpperCase()}</p>
                    <p style={commonTextStyle}>{cargo.toUpperCase()}</p>
                  </td>
                </tr>

                <tr>
                  <td style={{ height: '10px' }}></td>
                </tr>

                <tr>
                  <td>
                    <p style={underlineStyle}>{secretaria.toUpperCase()}</p>
                  </td>
                </tr>

                <tr>
                  <td style={{ height: '10px' }}></td>
                </tr>
                <tr>
                  <td>
                    <p style={commonTextStyle}>{email}</p>
                  </td>
                </tr>

                <tr>
                  <td style={{ height: '10px' }}></td>
                </tr>

                <tr>
                  <td>
                    <p style={commonTextStyle}>{endereco.replace('${andar}', andar)}</p>
                    <p style={commonTextStyle}>{telefone}</p>
                    <p style={commonTextStyle}>{endereco2}</p>
                  </td>
                </tr>

                <tr>
                  <td style={{ height: '10px' }}></td>
                </tr>

                <tr>
                  <td>
                    <p style={commonTextStyle}>{site}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    );
  }
);

CopyAssinatura.displayName = 'CopyAssinatura';