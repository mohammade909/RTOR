import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getQrLink } from "../redux/qrSlice";
import { useSelector, useDispatch } from "react-redux";
const BEP20QR = () => {
  const dispatch = useDispatch();
  const { qr } = useSelector((state) => state.qr);

  const [size, setSize] = useState(250); // QR code size in pixels

  useEffect(() => {
    dispatch(getQrLink());
  }, []);
  return (
    <div className="flex flex-col items-center">
      {/* <h2 className="mb-4 text-xl font-bold text-gray-800">{qr?.BEB20}</h2> */}

      {qr?.BEB20 && (
        <div className="flex flex-col items-center p-4 mt-2 bg-gray-50 rounded-lg">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <QRCodeSVG
              value={qr?.BEB20}
              size={size}
              level="H" // Error correction level: L, M, Q, H
              includeMargin={true}
            />
          </div>

          <div className="mt-4 text-gray-600 text-sm text-center break-all">
            <div className="font-semibold mb-1">Address:</div>
            <div>{qr?.BEB20}</div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                // For SVG, we need to create an image from the SVG first
                const svg = document.querySelector("svg");
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  canvas.width = size;
                  canvas.height = size;
                  const ctx = canvas.getContext("2d");
                  const img = new Image();
                  img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    const link = document.createElement("a");
                    link.download = `bep20-${qr?.BEB20.substring(0, 8)}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                  };
                  img.src =
                    "data:image/svg+xml;base64," +
                    btoa(unescape(encodeURIComponent(svgData)));
                }
              }}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Download QR
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(qr?.BEB20);
                // You might want to add a toast notification here
                alert("Address copied to clipboard!");
              }}
              className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700"
            >
              Copy Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BEP20QR;
