using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DelegateEvent
{
    internal class ControleRemoto
    {
        // Delegate para o evento de alteração de volume
        public event EventHandler VolumeAlterado;
        
        public int Volume { get; private set; }

        public ControleRemoto(int volumeInicial)
        {
            Volume = volumeInicial;
        }

        public void AumentarVolume()
        {
            Volume++;
            QuandoVolumeAlterado(EventArgs.Empty);
        }
        public void DiminuirVolume()
        {
            if (Volume > 0)
            {
                Volume--;
                QuandoVolumeAlterado(EventArgs.Empty);
            }
        }

        protected virtual void QuandoVolumeAlterado(EventArgs e)
        {
            VolumeAlterado?.Invoke(this, e);
        }
    }
}
