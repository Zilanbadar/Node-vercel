import { Cluster } from "puppeteer-cluster";
process.setMaxListeners(Infinity);
//import all the services
import aatalklinik from "./aatalklinik.js";
import krankenhausAugustin from "./krankenhausAugustin.js";
import krakehan from "./krakenhaus.js";
import dusseldorf from "./dusseldorf.js";
import zissendorf from "./zissendorf.js";
import zentren from "./zentren.js";
import wickerDe from "./WickerDe.js";
import wessel from "./wessel.js"
import telgte from "./Telgte.js";
import telget from "./telget.js";
import tecklenburg from "./tecklenburg.js";
import stifung from "./stifung.js";
import stellengabot from "./stellenangoBot.js";
import solingen from "./soligen.js";
import siegburg from "./Siegburg.js";
import stellenmarkt from "./settelenmarkt.js";
import schoen from "./schoen.js";
import sana from "./sana.js";
import salzkotten from "./salzkotten.js";
import salus from "./salus.js";
import saluss from "./salus2.js";
import roeher from "./roeher.js";
import rhienland from "./rheinland.js";
import remschield from "./remschied.js";
import rheinlandklinikum from "./rheinlandklinikum.js";
import remeo from "./remeo.js";
import rehankbw from "./RehanKbw.js";
import rehain from "./rehain.js";
import radivormwald from "./radivormwald.js";
import ptvSolingen from "./ptvSolingen.js";
import procelis from "./procelis.js";
import praxiklinik from "./praxiklinik.js";
import paracelsusKlinik from "./paracelsusKlinik.js";
import paracelsus from "./paracelsus.js";
import panklinik from "./panklinik.js";
import paderborn from "./paderborn.js";
import octapharmaplasma from "./octapharmaplasma.js";
import nwe from "./nwe.js"
import nordkirchen from "./nordkirchen.js";
import neuss from "./neuss.js";
import muehlenkerisKliniknew from "./muehlenkerisKliniknew.js";
import moers from "./moers.js";
import midzen from "./midzen.js";
import mettingen from "./mettingen.js";
import medicalPark from "./medicalPark.js";
import marienHospital from "./marienHospital.js";
import marienHospitalDusselDorf from "./MarienHospital-Dusseldorf.js";
import marien from "./marien.js";
import marienMarl from "./Marien-HospitalMarl.js";
import marienErwitte from "./Marien-HospitalErwitte.js";
import mariaHilf from "./MariaHilf-KrankenhausBergheim.js";
import mariaJosef from "./Maria-Josef-HospitalGreven.js";
import manusKlinik from "./ManusKlinik.js";
import malteser from "./MalteserKrankenhaus-StAnna.js";
import malteserAnna from "./MalteserKrankenhaus-StAnna.js";
import malteserJohannes from "./MalteserKrankenhausSt-Johannes-Stift.js";
import marienHospitalWattenscheid from "./Marien-HospitalWattenscheid.js";
import marienJobs from "./MarienBorn-jobs1.js";
import marienHospitalAachen from "./Marienhospital-Aachen.js";
import marienHospitalBottrop from "./Marienhospital-Bottrop.js";
import marienJobs1 from "./marienJobs.js";
import martinLuther from "./Martin-Luther-Krankenhaus.js";
import maternus from "./MATERNUS-Klinikfur-Rehabilitation.js";
import medianKlinik from "./MEDIAN-KlinikNRZ-BadSalzuflen.js";
import mediaTherapie from "./MEDIAN-Therapiezentrumund-Koln.js";
import medianAdaptions from "./MEDIANAdaptionshaus-Duisburg.js";
import medianagz from "./MEDIANAGZ-Dusseldorf.js";
import mediaKlinikDormagen from "./MEDIANKlinik-Dormagen.js";
import medianKlinikBurggraben from "./MEDIANKlinikBurggraben-BadSalzuflen.js";
import medianPark from "./MEDIANKlinikPark-BadOeynhausen.js";
import mediaTherapiezentrum from "./MEDIANTherapiezentrum-HausGrefrath.js";
import medianTherapiezentrumRemscheid from "./MEDIANTherapiezentrum-HausRemscheid.js";
import medianLohref from "./MEDIANTherapiezentrum-Loherhof.js";
import medianWelchenberg from "./MEDIANTherapiezentrum-Welchenberg.js";
import medianWerth from "./MEDIANTherapiezentrum-Werth.js";
import medianWillich from "./MEDIANTherapiezentrum-Willich.js";
import mediaParkKlinik from "./MediaPark-Klinik.js";
import medicalParkKlinik from "./MedicalPark-Klinik-amPark.js";
import mediClinFachklinik from "./MediClin-Fachklinik-RheinRuhr.js";
import mediclinRoseKlinik from "./MEDICLIN-RoseKlinik.js";
import medClinkKlinikReichshof from "./MediClin-Fachklinik-RheinRuhr.js";
import mdediClinRobert from "./MediClinRobert-JankerKlinik.js";
import mutterKindKlinik from "./Mutter-Kind-KlinikUNIVIT.js";
import mvzdrKretzmanKollengen from "./MVZDr-KretzmanKollegen.js";
import mvzLunen from "./MVZLunen-Dialysezentrum.js";
import lymphklinik from "./lymphklinik.js";
import lungenklinikHemer from "./LungenklinikHemer.js";
import lukusKarrier from "./lukusKarrier.js";
import lukasKranken from "./Lukas-KrankenhausBunde.js";
import luisen from "./luisenhospitalAachen.js";
import ludingHausen from "./ludinghausen.js";
import logopadischesReha from "./LogopadischesReha-Zentrum.js";
import lifespring from "./lifeSpring-Privatklinik.js";
import leverkusen from "./leverkusen.js";
import lennestadt from "./lennestadt.js";
import langenfeld from "./langenfeld.js";
import siegen from "./KreisklinikumSiegen.js";
import krefeld from "./krefeld.js";
import krankenhusEnger from "./Krankenhus-enger.js";
import krankenWermelskirchen from "./KrankenhausWermelskirchen.js";
import krankenhausPorzamRhein from "./krankenhausporzamRhein.js";
import krankenhausPlettenberg from "./krankenhausPlettenberg.js";
import krankenhausNeuwerk from "./krankenhausNeuwerk.js";
import krankenhausMara from "./KrankenhausMara.js";
import krankenhausDuren from "./KrankenhausDuren.js";
import krankenhausder from "./krankenhausder-Augustinerinnen.js";
import krankenhausBethanien from "./KrankenhausBethanien.js";
import krankenhausAugusting from "./krankenhausAugustin.js";
import krankenhaus from "./krakenhaus.js";
import koln1 from "./koln1.js";
import koln from "./koln.js";
import koenigsfelddeutsche from "./koenigsfelddeutsche.js";
import koaesthetics from "./Ko-AestheticsDusseldorf.js";
import klinilumBuchum from "./klinikumBochum.js";
import klinikumLeverKusen from "./Klinikum-Leverkusen-Leverkusen.js";
import klinikumHerford from "./Klinikum-Herford-Herford.js";
import klinikumGutersloh from "./Klinikum-Gutersloh-Gutersloh.js";
import klinikSorpesee from "./klinikSorpesee.js";
import klinikukum from "./KlinikKumHochsauland.js";
import klinikk from "./klinikk.js";
import klinikHellweg from "./KlinikHellweg.js";
import klinikEichholz from "./klinikEichholz.js";
import klinikAmRing from "./klinikAmRing.js";
import klinikakorso from "./KlinikamKorso.js";
import kkrn from "./kkrn.de.js";
import kkhm from "./kkhm.js";
import kinderHospiz from "./kinderhospiz.js";
import kemMed from "./KemMed.js";
import katheria from "./KathriaPortal.js";
import katharina from "./katharina.js";
import karrierWittenShord from "./KarrierWittenShordNew.js";
import karrierVCKGmbhNew1 from "./karrierVCKGmbhNew1.js";
import karrierKrappKrankus from "./KarrierKrappKrankus.js";
import karrierewittekindershof from "./karriere-wittekindshof.js";
import karrierDardenne from "./KarrierDardenne.js";
import karrierevkdusself from "./karrier-evk.dusself.js";
import karrerevkb from "./karrer.evkb.de.js";
import kaiserswerther from "./kaiserswerther.js";
import kaisaKarklinik from "./KaisaKarlKlinik.js";
import jungBurnerKlinik from "./jungburnnerKlinik.js";
import johaniterNew3 from "./JohanniterNew3.js";
import johanniterNew2 from "./JohanniterNew2.js";
import johanniterNew1 from "./JohanniterNew1.js";
import johanniterNew from "./JohanniterNew.js";
import johannite from "./johannite.js";
import jobsKfhDe from "./JobsKfhDe.js";
import jobsEvkMet from "./jobs.evk-met.js";
import huerth from "./huerth.js";
import hoxter from "./hoxter.js";
import hilden from "./hilden.js";
import herten from "./herten.js";
import hamm1 from "./hamm1.js";
import hamm from "./hamm.js";
import hachen from "./hachen.js";
import haan from "./haan.js";
import gutersloh from "./gutersloh.js";
import gut from "./gut.js";
import gronau from "./gronau.js";
import gledren from "./geldern.js";
import gelderlandKlinik from "./gelderlandKlinik.js";
import florence from "./florence.js";
import florenceNight from "./florence-night.js";
import fliednerDe from "./fliednerDe.js";
import fachKlinikHonheid from "./fachKlinikHonheid.js";
import fachKlinik360new from "./fachKlinik360new.js";
import fachKlinik from "./fachKlinik.js";
import fachKlinic from "./fachkilinic.js";
import fabricius from "./fabricius.js";
import evkwesel from "./evkwesel.js";
import evkkde from "./evkk.de.js";
import evkKoeln from "./evk-koeln.de.js";
import evkKarrier from "./evk-karrier.js";
import evkGeMein from "./evk_ge.mein.js";
import essen from "./essen.js";
import engelskirchen from "./engelskirchen.js";
import elisabeth from "./elisabeth.js";
import ekonline from "./ekonline.de.js";
import eko from "./eko.js";
import eduardus1 from "./eduardus1.js";
import dusseldrof from './dusseldrof.js';
import duren from "./duren.js";
import drvKarriere from "./drv-karriere.js";
import driefFaltigeHospital from "./dreifFaltigeHospital.js";
import drBecker14777 from "./DrBecker41777New.js";
import drBecker34644 from "./DrBecker34644New.js";
import drBecker34564 from "./DrBecker34564New.js";
import drBecker41452 from "./dr-becker41452.js";
import dortmund1 from "./dortmund1.js";
import dortmund2 from "./dortmund2.js";
import dortmund3 from "./dortmund3.js";
import dionyius from "./dionyius.js";
import dinslaken from "./dinslaken.js";
import diakonie from "./diakonie1.js";
import ddzNew from "./ddzNew1.js";
import contilia from "./contilia.js";
import christospherKliniken from "./christospherKliniken.js";
import celenusKarrer from "./celenusKarrer.js";
import celenus from "./celenus.js";
import castropRauxel from "./castropRauxel.js";
import cardioclinic from "./cardioclinic.js";
import bunde from "./bunde.js";
import bosselmann from "./bosselmann.js";
import bochum from "./bochum.js";
import bkPaderBorn from "./bkPaderBorn.js";
import bgKlinik1 from "./bgKlinik.js";
import bewerbungBergimanshiel from "./bewerbungBergimanshiel.js";
import bewerbung from "./bewerbung.js";
import bewerbungKlinikumWestFalen from "./bewebungKlinikumWestFalen.js";
import bethsedaKarNew from "./bethsedaKarNew.js";
import bethel from "./bethel.js";
import bethanIserlohnde from "./BethanIserlohnde.js";
import betaKlinik1 from "./betaKlinik1.js";
import besthedaWuppertal from "./BesthedaWuppertal.js";
import beroLinaKlinik1 from "./beroLinaKlinik1.js";
import bernath from "./bernath.js";
import badsassendorf from "./badsassendorf.js";
import badoexenDe from "./badoexenDe.js";
import badBerleburrg from "./badberleburrg.js";
import augestaKlinik from "./augestaKlinik.js";
import augenKlinik1 from "./augenKLinik1.js";
import asklepios from "./Asklepios.js";
import annClinic from "./annClinic.js";
import akhHagenDe from "./akhHagenDe.js";
import sanktJosef from "./Xanten/sanktJosef-Hospital.js";
import wurserlenone from "./wurselenOne/murselenOne.js";
import wuppertalOne from "./wuppertalOne/wuppertalOne.js";
import wunnenberg from "./Wunnenberg/atalklinik.js";
import wirsuchenmenschen from "./wirsuchenmenschen/wirsuchenmenschen.js";
import wicker from "./wicker/wicker.js";
import wesphelia from "./Westphalia/rosenberg.deutsche-rentenversicherung-reha-zentren.de.js";
import westfalenn from "./westfalenn/westfalenn.js";
import wesseling from "./Wesseling/dreifaltigkeits-Krankenhaus.js";
import wermelskirchen from "./wermelskirchen/wermelskirchen.js";
import werdohll from "./werdohll/werdohll.js";
import wedohl from "./werdohl/werdohl.js";
import vlotho from "./Vlotho/vlotho.js";
import teildesganzen from "./teildesganzen/teildesganzen.js";
import stellenangoBot from "./stellenangebote/stellenangebote.js";
import sigburg from "./sigburg/sigburg.js";
import severinskloeterchen from "./severinskloesterchen/severinskloesterchen.js";
import schwerte from './Schwerte/schwerte.js';
import rosenberg from "./rosenberg/rosenberg.js";
import rhine from "./Rheine/mathias-karriere.de.js";
import remschied from './Remscheid/sanaKlinikum-Remscheid.js';
import reha from "./reha/reha.js";
import quellenhof from "./Quellenhof/quellenhof.js";
import petershagen from "./Petershagen/petershagen.js";
import nettetal from "./nettetal/nettelal.js";
import netherlands from "./netherlands/netherlands.js";
import munsterOne from "./munsterOne/munster.js";
import munsterrOne from "./munster/munsterOne.js";
import mores from "./mores/mores.js";
import monchengladach from "./monchengladach/monchengladbach.js";
import monchengladbachOne from "./monchengladach/monchengladachOne.js";
import minden from "./minden/minden.js";
import mechrnich from "./Mechernich/kkMg.js";
import marsberg from "./marsberg/marsberg.js";
import marsbergOne from "./marsberg/marsbergOne.js";
import marsburgTwo from "./marsberg/marsbergTwo.js";
import maerkische from "./maerkische/maerkische.js";
import lvrOne from "./lvrOne/lvrOne.js";
import lvr from "./lvr/lvr.js";
import lukass from "./lukass/lukass.js";
import luisenhospital from "./luisenhospital/luisenhospital.js";
import luenen from "./luenen/luenen.js";
import logopadisch from "./logopadisch/logopadisch.js";
import lippstad from "./Lippstad/lippstad.js";
import lippee from "./lippee/lippee.js";
import lindenplatz from "./lindenplatz/lindenplatz.js";
import kreisSoset from "./kreisSoset/kreisSoset.js";
import KreisklinikumSiegen from "./kreisklinikumSiegen/kreisklinikumSiegen.js";
import krefeldd from "./krefeldd/krefeld.js";
import krankenhauss from "./krankenhauss/krankenhauss.js";
import krankenhausPorz from "./Koln/krankenhausPorz.js";
import kln from "./koln/koln.js";
import knappschaft from "./Knappschaft/knappschaft.js";
import kloster from "./kloster/kloster.js";
import kmt from "./kmt/kmt.js";
import klinikumOberberg from "./klinikumOberberg/klinikumoberberg.js";
import klinikumdo from "./klinikumdo/klinikumdo.js";
import klinikumbochum from "./klinikumbochum/klinikumbochum.js";
import klinikring from "./klinikring/klinikring.js";
import kkle from "./kkle/kkle.js";
import kempenOne from "./kempenOne/kempen.js";
import kem from "./kem/kem.js";
import katheKolwizHaus from "./Käthe-Kollwitz-Haus/karriere.johanneswerk.de.js";
import kath from "./kath/kath.js";
import karriere from "./karriere/karriere.js";
import kamen from "./kamen/kamen.js";
import kaiser from "./kaiser/kaiser.js";
import johanniterTwo from "./johanniterTwo/johanniterTwo.js";
import johanniterOne from "./johanniterOne/johanniterOne.js";
import johanniterFour from './johanniterFour/johanniterFour.js';
import johanneswerk from "./johanneswerk/johanneswerk.js";
import ibbenburen from "./Ibbenburen/ibbenburen.js";
import ibbenburen2 from "./ibbenbuerenn/ibbenbuerenn.js";
import hurth from "./Hurth/hurth.js";
import hospitalverbunt from "./hospitalverbunt/hospitalverbunt.js";
import hochsauerland from "./hochsauerland/hochsauerland.js";
import hindenburgstrasse from "./hindenburgstrasse/hindenburgstrasse.js";
import herverster from "./Hervester/kkrnCatholic-clinic.js";
import herford from "./herford/herford.js";
import hemer from "./Hemer/hemerOne.js";
import hellweg from "./hellweg/hellweg.js";
import heinsbergg from "./Heinsbergg/heinsbergg.js";
import heinsberg from "./heinsberg/heinsberg.js";
import havixbeck from "./havixbeck/havixbeck.js";
import hattingenn from "./Hattingenn/hattingenn.js";
import hagenn from "./hagenn/hagenn.js";
import guterslohh from "./gutersloh/guterslohOne.js";
import gummersbach from "./gummersbach/gummersbach.js"; 
import guetersloh from "./guetersloh/guetersloh.js";
import greven from "./greven/greven.js";
import gmbh from "./gmbh/gmbh.js";
import geseke from "./Geseke/geseke.js";
import gangelt from "./Gangelt/gangeltt.js";
import frieden from "./frieden/frieden.js";
import evkb from "./evkb/evkb.js";
import euskirchen from "./euskirchen/euskirchen.js"
import Erkelenz from "./Erkelenz/erkelenz.js";
import erkelenOne from "./erkelenOne/erkelen.js";
import eichholz from "./eichholz/eichholz.js";
import eduardus from "./eduardus/eduardus.js";
import dusseldorfOne from "./dusseldorf/dusseldorfOne.js";
import dusseldorfTwo from "./dusseldorf/dusseldorfTwo.js";
import bgKlinik from "./Duisburg/bgKlinik.js";
import duisburgTwo from "./Duisburg/duisburgTwo.js";
import duishburgTwo from "./Duisburg/duishburgTwo.js";
import guisburg from "./Duisburg/guisburg.js";
import drk from "./drk/drk.js";
import deutsche from "./deutsche/deutsche.js";
import datteln from "./Datteln/datteln.js";
import crisotphorus from "./christophorus/christophorus.js";
import bonnTwo from "./BonnTwo/bonnTwo.js";
import bonnOne from "./bonnOne/bonnOne.js";
import bochumOne from "./BochumOne/bochumOne.js";
import marienBornJob1 from "./MarienBorn-jobs1.js";
import bethal from "./bethal/bethal.js";
import beethovenClinic from "./BeethovenClinic/beethoven-klinik-koeln.de.js";
import bedburgHau from "./bedburgHau/bedburgHau.js";
import balthasar from "./balthasar/balthasar.js";
import badWaldliesborn from "./BadWaldliesborn/klinik-quellenhof.de.js";
import badSalzuflen from "./BadSalzuflen/DeutscheRentenversicherung.js";
import badOeynhausen from "./BadOeynhausenn/oeynhausenn.js";
import badMunstereiefel from "./badMunstereifel/badMunstereifel.js";
import badDriburgg from "./badDriburgg/badDriburgg.js";
import badDriburrg from "./BadDriburg/www.kbs.de.js";
import badSassendorf from "./Bad-Sassendorf/klinik-lindenplatz-de.js";
import attendorn from "./attendorn/attendorn.js";
import anfahrt from "./anfahrt/anfahrt.js";
import abteilungFur from "./AbteilungFur/abteilungFur.js";
import aachen from "./Aachen/luisenHospitalAachen.js";
import karrierKrapp from "./KarrierKrappKrankus.js";
import kreisklinikumSiegen from "./kreisklinikumSiegen/kreisklinikumSiegen.js";
import badDriburg from "./badDriburgg/badDriburgg.js";
import { CronJob } from "cron";
import MEDIANTherapiezentrum_HausRemscheid from "./MEDIANTherapiezentrum-HausRemscheid.js";
import haushohenlim1 from "./haushohenlim1.js";
// import marienJobs from "./marienJobs.js";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

//queue all the services using puppeteer cluster
const mainSerivce = async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 3,
        monitor: true,
        puppeteerOptions: {
            headless: true,
            devtools: false,
            args: ['--start-maximized']
        }
    });
    

const job1 = new CronJob(
  " 0 0 7,12,15 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await aatalklinik(cluster, page, positions, levels);
    });

    
    cluster.queue(async ({ page }) => {
        await krankenhausAugustin(cluster, page, positions, levels);
    });


    // And do more stuff..,
    cluster.queue(async ({ page }) => {
        await krakehan(cluster, page, positions, levels);
    });

    // And do more stuff...
    cluster.queue(async ({ page }) => {
        await dusseldorf(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await zissendorf(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await zentren(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await wickerDe(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job1.start();
   
    
const job2 = new CronJob(
  " 0 5 7,12,15 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await wessel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await velbert(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await toscarrer(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await telget(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await telgte(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await tecklenburg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await stJosef(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await stifung(cluster, page, positions, levels);
    });
      cluster.queue(async ({ page }) => {
          await haushohenlim1(cluster, page, positions, levels);
    })
  },
  null,
  true,
  "Europe/Berlin"
);

job2.start();
   
    
const job3 = new CronJob(
  " 0 10 7,12,15 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await stellengob(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await stellengabot(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await solingen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await siegburg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await stellenmarkt(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await schwelm(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await schoen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await schmallenberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await sana(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job3.start();
  
    
const job4 = new CronJob(
  " 0 15 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await salzkotten(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await salus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await saluss(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await roeher(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rhienland(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await remschield(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rheinlandklinikum(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await remeo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rehankbw(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rehain(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await recruitingApp(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job4.start();
   

    
const job5 = new CronJob(
  " 0 20 7,12,15 * * *",
  () => {
      cluster.queue(async ({ page }) => {
          await recruiting(cluster, page, positions, levels);
      }).catch(err => console.log(err));

    cluster.queue(async ({ page }) => {
        await radivormwald(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await ptvSolingen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await procelis(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await praxiklinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await paracelsusKlinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await paracelsus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await panklinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await paderborn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await octapharmaplasma(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await malteserJohannes(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await nwe(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await nrkAarchen(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job5.start();
   
    
const job6 = new CronJob(
  " 0 25 7,12,15 * * *",
    () => {
        cluster.queue(async ({ page }) => {
        await nordkirchen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await neuss(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await munsterr(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await munster(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await muehlenkerisKliniknew(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await moers(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await mindern(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await midzen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await mettingen(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);
    
    job6.start();
    
   
const job7 = new CronJob(
  " 0 30 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await medicalPark(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marienHospital(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marienHospitalDusselDorf(cluster, page, positions, levels);
     });

    cluster.queue(async ({ page }) => {
        await marienMarl(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marien(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await marienErwitte(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await mariaHilf(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job7.start();
   
    
const job8 = new CronJob(
  " 0 35 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await mariaJosef(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await manusKlinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await malteser(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await malteserAnna(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lymphklinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lwlJob(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        lungenklinikHemer(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lukusKarrier(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lukasKranken(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job8.start();
   

    
const job9 = new CronJob(
  " 0 40 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await luisen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await ludingHausen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await logopadischesReha(cluster, page, positions, levels);
    });
      
    cluster.queue(async ({ page }) => {
        await lifespring(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await leverkusen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lennestadt(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lengerich(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await langenfeld(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await siegen(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job9.start();
    

    
const job10 = new CronJob(
  " 0 45 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await krefeld(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhusEnger(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await krankenWermelskirchen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausPorzamRhein(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausPlettenberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausNeuwerk(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausMorsenbroich(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausMara(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausDuren(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await krankenhausder(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job10.start();
   

    
const job11 = new CronJob(
  " 0 50 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await krankenhausBethanien(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhausAugusting(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krankenhaus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await koln1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await koln(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await koenigsfelddeutsche(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await koaesthetics(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinilumBuchum(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job11.start();
   
    
const job12 = new CronJob(
  " 0 55 7,12,15 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await klinikumLeverKusen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumLeverKusen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumHerford(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumGutersloh(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikSorpesee(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikukum(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikk(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikHellweg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikEichholz(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikAmRing(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job12.start();
    
    
const job13 = new CronJob(
  " 0 0 8,13,16 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await klinikakorso(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kkrn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kkhm(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kinderHospiz(cluster, page, positions, levels);
    });
    

    cluster.queue(async ({ page }) => {
        await kemMed(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await katheria(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await katharina(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job13.start();
   
    
const job14 = new CronJob(
  " 0 5 8,13,16 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await karrierWittenShord(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrierVCKGmbhNew1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrierKrappKrankus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrierewittekindershof(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrierDardenne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrierevkdusself(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karrerevkb(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kaiserswerther(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kaisaKarklinik(cluster, page, positions, levels);
    });
    
  },
  null,
  true,
  "Europe/Berlin"
);

job14.start();
    const job15 = new CronJob(
  " 0 10 8,13,16 * * *",
  () => {
    
    cluster.queue(async ({ page }) => {
        await jungBurnerKlinik(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await johaniterNew3(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await kaiserswerther(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await johanniterNew2(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await johanniterNew1(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await johannite(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await johanniterNew(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await jobsKfhDe(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await jobsEvkMet(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await huerth(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hoxter(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hilden(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await herten(cluster, page, positions, levels);
    });
   
  },
  null,
  true,
  "Europe/Berlin"
);

job15.start();
   

const job16 = new CronJob(
  " 0 15 8,13,16 * * *",
  () => {

    cluster.queue(async ({ page }) => {
        await hamm1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hamm(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hachen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await haan(cluster, page, positions, levels);
    });
   

    cluster.queue(async ({ page }) => {
        await gut(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job16.start();
  
    
const job17 = new CronJob(
  " 0 20 8,13,16 * * *",
  () => {

    cluster.queue(async ({ page }) => {
        await gronau(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await gledren(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await gelderlandKlinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await florence(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await florenceNight(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await fliednerDe(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await fachKlinikHonheid(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await fachKlinik360new(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await fachKlinic(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await fachKlinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await fabricius(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job17.start(); 
const job18 = new CronJob(
  " 0 25 8,13,16 * * *",
  () => {
        cluster.queue(async ({ page }) => {
        await evkwesel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkkde(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkKoeln(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkKarrier(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkKarriere(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkGeMein(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await essen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await engelskirchen(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job18.start();

const job19 = new CronJob(
  " 0 30 8,13,16 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await elisabeth(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await ekonline(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await eko(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await eduardus1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dusseldorf(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dusseldrof(cluster, page, positiosns, levels);
    });

    cluster.queue(async ({ page }) => {
        await duren(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await duisbergOne(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await duisberg(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await drvKarriere(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await driefFaltigeHospital(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);
    
    job19.start();

    const job20 = new CronJob(
  " 0 35 8,13,16 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await driefFaltigeHospital(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await drBecker14777(cluster, page, positions, levels);
    });
    cluster.queue(async ({ page }) => {
        await drBecker34644(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await drBecker34564(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await drBecker41452(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dortmund1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dortmund2(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dortmund3(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await dionyius(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dinslaken(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await diakonie(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job20.start();
    
   
const job21 = new CronJob(
  " 0 40 8,13,16 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await ddzNew(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await contilia(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await christospherKliniken(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await celenusKarrer(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await celenus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await castropRauxel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await cardioclinic(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bunde(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await alexir(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await bosselmann(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job21.start();
    
    const job22 = new CronJob(
  " 0 45 8,13,16 * * *",
  () => {
      cluster.queue(async ({ page }) => {
        await bochum(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bkPaderBorn(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await BgKlinik1(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await bgKlinik1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bewerbungBergimanshiel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bewerbung(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bewerbungKlinikumWestFalen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bethsedaKarNew(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bethel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bethanIserlohnde(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await betaKlinik1(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job22.start();
   
  const job23 = new CronJob(
  " 0 50 8,13,16 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await besthedaWuppertal(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await beroLinaKlinik1(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bernath(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bergamanClinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await beckum(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badWesternakotten(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badsassendorf(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badoexenDe(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badBerleburrg(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await augestaKlinik(cluster, page, position, levels);
    });

    cluster.queue(async ({ page }) => {
        await augenKlinik(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job23.start();
   
    const job24 = new CronJob(
  " 0 55 8,13,16 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await atosKarrier(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await asklepios(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await annClinic(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await akhHagenDe(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await sanktJosef(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await wurserlenone(cluster, page, positions, levels);
    });
        

    cluster.queue(async (page) => {
        await wuppertalOne(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await wuppertalTwo(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await wunnenberg(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await wirsuchenmenschen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await wicker(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job24.start();
   
const job25 = new CronJob(
  " 0 0 9,14,17 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await wesphelia(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await westfalenn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await wesseling(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await wermelskirchen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await werdohll(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await wedohl(cluster, page, positions, levels);
    });
    
    // cluster.queue(async ({ page }) => {
    //     await Weidenauer(cluster, page, positions, levels);
    // });

    // cluster.queue(async ({ page }) => {
    //     await warstein(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await vlotho(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await teildesganzen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await stellenangoBot(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job25.start();

   
const job26 = new CronJob(
  " 0 5 9,14,17 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await sigburg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await severinskloeterchen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await schwerte(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await schewelm(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rosenberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rosenberrg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await rhine(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await remschied(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await reha(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await quellenhof(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job26.start();
   
const job27 = new CronJob(
  " 0 10 9,14,17 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await petershagen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await nettetal(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await netherlands(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await munsterOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await munsterrOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await mores(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await monchengladach(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await monchengladach(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job27.start();
    
    const job28 = new CronJob(
  " 0 15 9,14,17 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await monchengladbachOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await minden(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await mechrnich(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await mathias(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await marsberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marsbergOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marsburgTwo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await maerkische(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lvrOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lvr(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lukass(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await luisenhospital(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await luenen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await logopadisch(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lippstad(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job28.start();

    const job29 = new CronJob(
  " 0 20 9,14,17 * * *",
  () => {
    
    cluster.queue(async ({ page }) => {
        await lippee(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await lindenplatz(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await leverkusan(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await kreisSoset(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await KreisklinikumSiegen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await krefeldd(cluster, page, positions, levels);
    });

    // cluster.queue(async (page) => {
    //     await krankenhausWastein(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await krankenhauss(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await kpw(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await krankenhausPorz(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kln(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await knappschaft(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kloster(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job29.start();
   
const job30 = new CronJob(
  " 0 25 9,14,17 * * *",
  () => {
    cluster.queue(async ({ page }) => {
        await kmt(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumOberberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumdo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikumbochum(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await klinikring(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kkle(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kempenOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kem(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await katheKolwizHaus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kath(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await karriere(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kamen(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job30.start();
    
const job31 = new CronJob(
  " 0 25 9,14,17 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await kaiser(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await johanniterThree(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await johanniterTwo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await johanniterOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await johanniterFour(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await johanneswerk(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await ibbenburen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await ibbenburen2(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hurth(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hospitalverbunt(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job31.start();

   
const job32 = new CronJob(
  " 0 25 9,14,17 * * *",
  () => {
     cluster.queue(async ({ page }) => {
        await hochsauerland(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hindenburgstrasse(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await herverster(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await herford(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hemer(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hemer(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hellweg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await heinsbergg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await heinsberg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await havixbeck(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await hattingenn(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job32.start();
   
    const job33 = new CronJob(
  " 0 30 9,14,17 * * *",
  () => {
      cluster.queue(async ({ page }) => {
        await hagenn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await gutersloh(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await guterslohh(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await gummersbach(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await guetersloh(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await greven(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await gmbh(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await geseke(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await gangelt(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await frieden(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await evkb(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job33.start();
  

const job34 = new CronJob(
  " 0 35 9,14,17 * * *",
  () => {
      cluster.queue(async ({ page }) => {
        await euskirchen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await Erkelenz(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await erkelenOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await eichholz(cluster, page, positions, levels);
    });

    cluster.queue(async({page}) =>{
        await eduardus(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dusseldorfOne(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await dusseldorfTwo(cluster, page, positions, levels);
    });

    cluster.queue(async({page}) =>{
        await bgKlinik(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await duisburgTwo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await duishburgTwo(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job34.start();
  
const job35 = new CronJob(
  " 0 40 9,14,17 * * *",
  () => {
      cluster.queue(async ({ page }) => {
        await guisburg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await drk(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await deutsche(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await datteln(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await crisotphorus(cluster, page, positions, levels);
    });
    
    cluster.queue(async ({ page }) => {
        await bonnTwo(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await bonnOne(cluster, page, positions, levels);
    });

    // cluster.queue(async ({ page }) => {
    //     await bonnn(cluster, page, positions, levels);
    // });

    cluster.queue(async ({ page }) => {
        await bochumOne(cluster, page, positions, levels);
    });

  },
  null,
  true,
  "Europe/Berlin"
);

job35.start();

  
    const job36 = new CronJob(
  " 0 45 9,14,17 * * *",
  () => {
  
    cluster.queue(async ({ page }) => {
        await bethal(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await beethovenClinic(cluster, page, positions, levels);
    });

    cluster.queue(async (page) => {
        await bedburgHau(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await balthasar(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badWaldliesborn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badSalzuflen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badOeynhausen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badMunstereiefel(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badDriburgg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badDriburrg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badSassendorf(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

job36.start();
   

const job37 = new CronJob(
  " 0 50 9,14,17 * * *",
  () => {
     

    cluster.queue(async ({ page }) => {
        await attendorn(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await anfahrt(cluster, page, positions, levels);
    });
   
    cluster.queue(async ({ page }) => {
        await abteilungFur(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await aachen(cluster, page, positions, levels);
    });


    cluster.queue(async ({ page }) => {
        await karrierKrapp(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await kreisklinikumSiegen(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await badDriburg(cluster, page, positions, levels);
    });

    cluster.queue(async ({ page }) => {
        await marienJobs(cluster, page, positions, levels);
    });
  },
  null,
  true,
  "Europe/Berlin"
);

    job37.start();
    
    let job38 = new CronJob(
        "0 0 10,15,18 * * *", () => {
            cluster.queue(async ({ page }) => {
                await marienHospitalWattenscheid(cluster, page, positions, levels);
            });
    
            cluster.queue(async ({ page }) => {
                await marienBonJobs1(cluster, page, positions, levels);
            });


            cluster.queue(async ({ page }) => {
                await marienHospitalAachen(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await marienHospitalBottrop(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await marienJobs1(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await martinLuther(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await maternus(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await medianKlinik(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await mediaTherapie(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await medianAdaptions(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianagz(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await mediaKlinikDormagen(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianKlinikBurggraben(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianPark(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mediaTherapiezentrum(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianTherapiezentrumRemscheid(cluster, page, positions, levels);
            });
      
            cluster.queue(async ({ page }) => {
                await medianLohref(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianWelchenberg(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianWillich(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mediaParkKlinik(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medianWerth(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medicalParkKlinik(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mediClinFachklinik(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mediclinRoseKlinik(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await medClinkKlinikReichshof(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mdediClinRobert(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mutterKindKlinik(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mvzdrKretzmanKollengen(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await mvzLunen(cluster, page, positions, levels);
            });
            cluster.queue(async ({ page }) => {
                await MEDIANTherapiezentrum_HausRemscheid(cluster, page, positions, levels);
            });
        }
    );
    job38.start();
    await cluster.idle();
    await cluster.close();
    
};

export default mainSerivce;