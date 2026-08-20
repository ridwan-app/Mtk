import React from 'react';
import { MiniGame } from '../../types';
import {
  BalapKarungGame,
  TarikTambangGame,
  EngklekAngkaGame,
  UlarNagaGame,
  GobakSodorGame,
} from './FaseAGames';
import {
  CongklakHitungGame,
  LayangLayangPecahanGame,
  BentenganBangunDatarGame,
  PetakJongkokDataGame,
  EgrangBilanganBulatGame,
  DamDamanPembagianGame,
  GasingSimetriGame,
  UlarTanggaWaktuGame,
  PasarPasaranUangGame,
  KelerengSudutGame,
} from './FaseBGames';
import {
  PetakUmpetSkalaGame,
  KelerengStatistikGame,
  GasingFPBKPKGame,
  RumahRumahanVolumeGame,
  DamDamanDesimalGame,
} from './FaseCGames';

interface TraditionalMiniGameArenaProps {
  game: MiniGame;
  onBack: () => void;
  onReward: (coins: number) => void;
}

export const TraditionalMiniGameArena: React.FC<TraditionalMiniGameArenaProps> = ({
  game,
  onBack,
  onReward,
}) => {
  // Dispatch to the exact dedicated game component based on game.id
  switch (game.id) {
    // === FASE A (5 Game) ===
    case 'balap-karung-a':
    case 'balap-karung':
      return <BalapKarungGame game={game} onBack={onBack} onReward={onReward} />;

    case 'tarik-tambang-a':
    case 'tarik-tambang':
      return <TarikTambangGame game={game} onBack={onBack} onReward={onReward} />;

    case 'engklek-angka-a':
    case 'engklek-angka':
      return <EngklekAngkaGame game={game} onBack={onBack} onReward={onReward} />;

    case 'ular-naga-a':
    case 'ular-naga':
      return <UlarNagaGame game={game} onBack={onBack} onReward={onReward} />;

    case 'gobak-sodor-a':
    case 'gobak-sodor':
      return <GobakSodorGame game={game} onBack={onBack} onReward={onReward} />;

    // === FASE B (10 Game Tradisional Lengkap) ===
    case 'congklak-hitung-b':
    case 'congklak-hitung':
      return <CongklakHitungGame game={game} onBack={onBack} onReward={onReward} />;

    case 'layang-layang-pecahan-b':
    case 'layang-layang-b':
    case 'layang-layang':
      return <LayangLayangPecahanGame game={game} onBack={onBack} onReward={onReward} />;

    case 'egrang-bilangan-bulat-b':
    case 'egrang-b':
    case 'egrang':
      return <EgrangBilanganBulatGame game={game} onBack={onBack} onReward={onReward} />;

    case 'bentengan-bangun-datar-b':
    case 'bentengan-b':
    case 'bentengan':
      return <BentenganBangunDatarGame game={game} onBack={onBack} onReward={onReward} />;

    case 'petak-jongkok-data-b':
    case 'petak-jongkok-b':
    case 'petak-jongkok':
      return <PetakJongkokDataGame game={game} onBack={onBack} onReward={onReward} />;

    case 'dam-daman-pembagian-b':
    case 'dam-daman-pembagian':
      return <DamDamanPembagianGame game={game} onBack={onBack} onReward={onReward} />;

    case 'gasing-simetri-b':
    case 'gasing-simetri':
      return <GasingSimetriGame game={game} onBack={onBack} onReward={onReward} />;

    case 'ular-tangga-waktu-b':
    case 'ular-tangga-waktu':
    case 'ular-tangga':
      return <UlarTanggaWaktuGame game={game} onBack={onBack} onReward={onReward} />;

    case 'pasar-pasaran-uang-b':
    case 'pasar-pasaran-uang':
    case 'pasar-pasaran':
      return <PasarPasaranUangGame game={game} onBack={onBack} onReward={onReward} />;

    case 'kelereng-sudut-b':
    case 'kelereng-sudut':
      return <KelerengSudutGame game={game} onBack={onBack} onReward={onReward} />;

    // === FASE C (5 Game) ===
    case 'petak-umpet-skala-c':
    case 'petak-umpet':
      return <PetakUmpetSkalaGame game={game} onBack={onBack} onReward={onReward} />;

    case 'kelereng-statistik-c':
    case 'kelereng-statistik':
      return <KelerengStatistikGame game={game} onBack={onBack} onReward={onReward} />;

    case 'gasing-fpb-kpk-c':
    case 'gasing-fpb-kpk':
      return <GasingFPBKPKGame game={game} onBack={onBack} onReward={onReward} />;

    case 'rumah-volume-c':
    case 'rumah-rumahan-volume':
      return <RumahRumahanVolumeGame game={game} onBack={onBack} onReward={onReward} />;

    case 'dam-daman-desimal-c':
    case 'dam-daman-c':
    case 'dam-daman':
      return <DamDamanDesimalGame game={game} onBack={onBack} onReward={onReward} />;

    default:
      // Fallback to Balap Karung if unknown id
      return <BalapKarungGame game={game} onBack={onBack} onReward={onReward} />;
  }
};
